#!/usr/bin/env node
/**
 * Meshy AI — Text-to-3D pipeline for APEX
 * ----------------------------------------
 * Generates premium 3D hero objects (.glb) via the Meshy AI OpenAPI (v2),
 * downloading them into public/models/ ready for three.js / @react-three/drei useGLTF.
 *
 * Pipeline per object:  create PREVIEW  →  poll until SUCCEEDED  →
 *                       create REFINE (PBR textures) from preview id  →
 *                       poll until SUCCEEDED  →  download model_urls.glb.
 *
 * Usage (Bash — DO NOT use PowerShell, it mangles Bearer headers):
 *   export MESHY_API_KEY=$(grep -E '^MESHY_API_KEY=' .env.local | cut -d= -f2)
 *   node scripts/meshy/generate.mjs                 # full run (all objects)
 *   node scripts/meshy/generate.mjs apex-monolith   # only the named object(s)
 *
 * The key is read from process.env.MESHY_API_KEY only — never hardcode it.
 * Requires Node 18+ (uses native fetch). Tested on Node 24.
 */

import { mkdir, writeFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const API_BASE = "https://api.meshy.ai/openapi";
const API_KEY = process.env.MESHY_API_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// scripts/meshy/generate.mjs  ->  repo root is two levels up
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const OUTPUT_DIR = path.join(REPO_ROOT, "public", "models");

// Polling / retry tuning
const POLL_INTERVAL_MS = 10_000; // 10s between status checks
const TASK_TIMEOUT_MS = 10 * 60_000; // 10 min per task (preview OR refine)
const MAX_RETRIES = 5; // for transient HTTP / 429 errors
const RATE_LIMIT_BACKOFF_MS = 20_000; // base wait on HTTP 429

// Shared generation settings for the APEX aesthetic:
// aerospace instrument, minimalist, premium — brushed metal + dark glass, sharp facets.
const PREVIEW_DEFAULTS = {
  mode: "preview",
  art_style: "realistic", // realistic gives the premium metal/glass look; sculpture = smoother/clay
  ai_model: "meshy-5",
  should_remesh: true,
  topology: "triangle", // triangle is what three.js renders; smaller GLB than quad
  target_polycount: 30_000, // enough detail for a hero object without a huge file
  symmetry_mode: "auto",
  target_formats: ["glb"],
  origin_at: "center", // center pivot => easy to place/rotate in three.js
};

const REFINE_DEFAULTS = {
  mode: "refine",
  enable_pbr: true, // PBR maps (metalness/roughness/normal) — key for the premium metal/glass feel
  ai_model: "meshy-5",
  target_formats: ["glb"], // GLB embeds the PBR textures, single self-contained file
  origin_at: "center",
};

// The objects to generate. Order matters: apex-monolith runs first as the
// end-to-end pipeline smoke test (see main()).
const OBJECTS = [
  {
    name: "apex-monolith",
    prompt:
      "A sleek minimalist faceted monolith obelisk, premium aerospace-grade brushed metal and dark glass, sharp geometric facets, futuristic tech artifact, matte black with subtle metallic edges, studio product render",
  },
  {
    name: "apex-core-orb",
    prompt:
      "A futuristic spherical tech core with concentric mechanical rings, aerospace instrument aesthetic, brushed titanium and dark glass, glowing seams, precision engineered, studio render",
  },
  {
    name: "apex-craft",
    prompt:
      "A minimalist stylized aerospace craft, sharp aerodynamic silhouette, matte metal fuselage, premium clean sci-fi geometric design, floating hero object",
  },
  {
    name: "apex-gem",
    prompt:
      "A high quality faceted crystal gem, sharp precise facets, translucent glass with internal refraction, premium jewel, studio product render",
  },
];

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function log(name, msg) {
  const ts = new Date().toISOString().slice(11, 19);
  console.log(`[${ts}] [${name}] ${msg}`);
}

function fmtBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * fetch wrapper: attaches auth, parses JSON, retries on 429 / 5xx / network errors.
 * Throws on non-retryable errors (4xx other than 429) or after MAX_RETRIES.
 */
async function api(pathname, { method = "GET", body, name = "meshy" } = {}) {
  const url = `${API_BASE}${pathname}`;
  let attempt = 0;

  while (true) {
    attempt++;
    let res;
    try {
      res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (err) {
      // network-level failure
      if (attempt > MAX_RETRIES) throw new Error(`Network error after ${MAX_RETRIES} retries: ${err.message}`);
      const wait = RATE_LIMIT_BACKOFF_MS * attempt;
      log(name, `network error (${err.message}); retry ${attempt}/${MAX_RETRIES} in ${wait / 1000}s`);
      await sleep(wait);
      continue;
    }

    // Rate limited -> honor Retry-After if present, else linear backoff
    if (res.status === 429) {
      if (attempt > MAX_RETRIES) throw new Error(`Rate limited (429) after ${MAX_RETRIES} retries`);
      const retryAfter = Number(res.headers.get("retry-after"));
      const wait = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : RATE_LIMIT_BACKOFF_MS * attempt;
      log(name, `rate limited (429); waiting ${wait / 1000}s then retry ${attempt}/${MAX_RETRIES}`);
      await sleep(wait);
      continue;
    }

    // Transient server errors -> retry
    if (res.status >= 500) {
      if (attempt > MAX_RETRIES) throw new Error(`Server error ${res.status} after ${MAX_RETRIES} retries`);
      const wait = RATE_LIMIT_BACKOFF_MS * attempt;
      log(name, `server ${res.status}; retry ${attempt}/${MAX_RETRIES} in ${wait / 1000}s`);
      await sleep(wait);
      continue;
    }

    const text = await res.text();
    let json;
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      json = { _raw: text };
    }

    if (!res.ok) {
      const detail = json?.message || json?.error || text || `HTTP ${res.status}`;
      throw new Error(`${method} ${pathname} failed: ${res.status} ${detail}`);
    }
    return json;
  }
}

// ---------------------------------------------------------------------------
// Meshy task primitives
// ---------------------------------------------------------------------------

async function createPreviewTask(name, prompt) {
  const body = { ...PREVIEW_DEFAULTS, prompt };
  const json = await api("/v2/text-to-3d", { method: "POST", body, name });
  const id = json.result;
  if (!id) throw new Error(`No task id in preview response: ${JSON.stringify(json)}`);
  log(name, `preview task created: ${id}`);
  return id;
}

async function createRefineTask(name, previewTaskId, prompt) {
  // texture_prompt reuses the object prompt to steer PBR textures toward the same look
  const body = { ...REFINE_DEFAULTS, preview_task_id: previewTaskId, texture_prompt: prompt };
  const json = await api("/v2/text-to-3d", { method: "POST", body, name });
  const id = json.result;
  if (!id) throw new Error(`No task id in refine response: ${JSON.stringify(json)}`);
  log(name, `refine task created: ${id}`);
  return id;
}

async function getTask(id, name) {
  return api(`/v2/text-to-3d/${id}`, { name });
}

/**
 * Poll a task until it SUCCEEDS. Throws on FAILED/CANCELED or timeout.
 * Returns the final task object.
 */
async function pollUntilDone(id, name, label) {
  const started = Date.now();
  let lastProgress = -1;

  while (true) {
    if (Date.now() - started > TASK_TIMEOUT_MS) {
      throw new Error(`${label} task ${id} timed out after ${TASK_TIMEOUT_MS / 60000} min`);
    }

    const task = await getTask(id, name);
    const { status, progress = 0, task_error } = task;

    if (progress !== lastProgress || status !== "IN_PROGRESS") {
      log(name, `${label}: ${status} ${progress}%`);
      lastProgress = progress;
    }

    if (status === "SUCCEEDED") return task;
    if (status === "FAILED" || status === "CANCELED") {
      const msg = task_error?.message || task_error || "unknown error";
      throw new Error(`${label} task ${id} ${status}: ${JSON.stringify(msg)}`);
    }

    await sleep(POLL_INTERVAL_MS);
  }
}

async function downloadGlb(url, destPath, name) {
  const res = await fetch(url); // signed URL, no auth header needed
  if (!res.ok) throw new Error(`GLB download failed: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(destPath, buf);
  return buf.length;
}

// ---------------------------------------------------------------------------
// One full object: preview -> refine -> download
// ---------------------------------------------------------------------------

async function textTo3D(name, prompt) {
  const t0 = Date.now();
  log(name, "=== START ===");

  // 1) PREVIEW (geometry only)
  const previewId = await createPreviewTask(name, prompt);
  const preview = await pollUntilDone(previewId, name, "preview");
  const previewCredits = preview.consumed_credits ?? 0;

  // 2) REFINE (adds PBR textures to the preview mesh)
  const refineId = await createRefineTask(name, previewId, prompt);
  const refine = await pollUntilDone(refineId, name, "refine");
  const refineCredits = refine.consumed_credits ?? 0;

  // 3) DOWNLOAD glb
  const glbUrl = refine?.model_urls?.glb;
  if (!glbUrl) throw new Error(`No model_urls.glb on refined task: ${JSON.stringify(refine.model_urls)}`);

  const destPath = path.join(OUTPUT_DIR, `${name}.glb`);
  const bytes = await downloadGlb(glbUrl, destPath, name);

  if (bytes < 50 * 1024) {
    // Sanity guard: a real textured hero mesh should comfortably exceed 50KB.
    throw new Error(`Downloaded GLB is suspiciously small (${fmtBytes(bytes)}) — treating as failure`);
  }

  const totalCredits = previewCredits + refineCredits;
  const secs = ((Date.now() - t0) / 1000).toFixed(0);
  log(name, `DONE in ${secs}s -> public/models/${name}.glb (${fmtBytes(bytes)}), ~${totalCredits} credits`);

  return {
    name,
    ok: true,
    path: destPath,
    bytes,
    credits: totalCredits,
    previewId,
    refineId,
    thumbnail: refine.thumbnail_url || preview.thumbnail_url || null,
  };
}

// ---------------------------------------------------------------------------
// Balance
// ---------------------------------------------------------------------------

async function getBalance() {
  try {
    const json = await api("/v1/balance", { name: "meshy" });
    return json.balance;
  } catch (err) {
    log("meshy", `could not read balance: ${err.message}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (!API_KEY) {
    console.error(
      "ERROR: MESHY_API_KEY is not set. Run:\n" +
        "  export MESHY_API_KEY=$(grep -E '^MESHY_API_KEY=' .env.local | cut -d= -f2)",
    );
    process.exit(1);
  }

  await mkdir(OUTPUT_DIR, { recursive: true });

  // Optional CLI filter: only generate the named objects.
  const filter = process.argv.slice(2);
  let queue = OBJECTS;
  if (filter.length) {
    queue = OBJECTS.filter((o) => filter.includes(o.name));
    if (!queue.length) {
      console.error(`No objects match: ${filter.join(", ")}. Known: ${OBJECTS.map((o) => o.name).join(", ")}`);
      process.exit(1);
    }
  }

  const balanceBefore = await getBalance();
  log("meshy", `balance before: ${balanceBefore ?? "unknown"} credits`);
  log("meshy", `objects to generate: ${queue.map((o) => o.name).join(", ")}`);

  const results = [];
  const failures = [];

  for (const obj of queue) {
    try {
      const r = await textTo3D(obj.name, obj.prompt);
      results.push(r);
    } catch (err) {
      log(obj.name, `FAILED: ${err.message}`);
      failures.push({ name: obj.name, error: err.message });
      // keep going with the rest
    }
  }

  const balanceAfter = await getBalance();

  // ---- Final report ----
  console.log("\n============================================================");
  console.log("MESHY GENERATION REPORT");
  console.log("============================================================");
  console.log(`Balance: ${balanceBefore ?? "?"} -> ${balanceAfter ?? "?"} credits` +
    (balanceBefore != null && balanceAfter != null ? ` (spent ~${balanceBefore - balanceAfter})` : ""));

  console.log(`\nSUCCEEDED (${results.length}):`);
  for (const r of results) {
    console.log(`  ✓ ${r.name}  ${fmtBytes(r.bytes)}  ~${r.credits} cr  -> ${path.relative(REPO_ROOT, r.path)}`);
  }

  console.log(`\nFAILED (${failures.length}):`);
  for (const f of failures) {
    console.log(`  ✗ ${f.name}: ${f.error}`);
  }
  console.log("============================================================\n");

  // Non-zero exit if everything failed, so callers/CI can detect it.
  if (results.length === 0) process.exit(1);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
