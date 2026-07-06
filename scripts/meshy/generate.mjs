#!/usr/bin/env node
/**
 * Meshy AI — Text-to-3D pipeline for the APEX muestrario
 * ------------------------------------------------------
 * Generates premium 3D artifacts (.glb) via the Meshy AI OpenAPI (v2),
 * optimizes each one (quantize + webp textures) and saves a webp thumbnail,
 * ready for three.js / @react-three/drei useGLTF.
 *
 * Pipeline per object:  create PREVIEW → poll → create REFINE (PBR) → poll →
 *                       download raw glb → gltf-transform optimize → sharp thumb.
 *
 * Runs a small concurrency pool (MESHY_CONCURRENCY, default 3) so 36 objects
 * don't take all afternoon. The api() helper already backs off on 429/5xx.
 *
 * Usage (Bash — DO NOT use PowerShell, it mangles Bearer headers):
 *   export MESHY_API_KEY=$(grep -E '^MESHY_API_KEY=' .env.local | cut -d= -f2)
 *   node scripts/meshy/generate.mjs                 # all NEW roster entries
 *   node scripts/meshy/generate.mjs --all           # include the `existing` ones too
 *   node scripts/meshy/generate.mjs apex-flora-loto # only the named object(s)
 *
 * The key is read from process.env.MESHY_API_KEY only — never hardcode it.
 * Requires Node 18+ (native fetch), `sharp`, and `@gltf-transform/cli` (npx).
 */

import { mkdir, writeFile, rm, copyFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import sharp from "sharp";
import { ROSTER, NEW_ENTRIES } from "./roster.mjs";

const execFileP = promisify(execFile);

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const API_BASE = "https://api.meshy.ai/openapi";
const API_KEY = process.env.MESHY_API_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const OUTPUT_DIR = path.join(REPO_ROOT, "public", "models");
const THUMB_DIR = path.join(OUTPUT_DIR, "thumbs");
const RAW_DIR = path.join(__dirname, ".raw"); // transient un-optimized downloads
const MANIFEST = path.join(__dirname, "roster-manifest.json");

const CONCURRENCY = Math.max(1, Number(process.env.MESHY_CONCURRENCY) || 3);

const POLL_INTERVAL_MS = 10_000;
const TASK_TIMEOUT_MS = 12 * 60_000; // 12 min per task (preview OR refine)
const MAX_RETRIES = 5;
const RATE_LIMIT_BACKOFF_MS = 20_000;

const PREVIEW_DEFAULTS = {
  mode: "preview",
  art_style: "realistic",
  ai_model: "meshy-5",
  should_remesh: true,
  topology: "triangle",
  target_polycount: 30_000,
  symmetry_mode: "auto",
  target_formats: ["glb"],
  origin_at: "center",
};

const REFINE_DEFAULTS = {
  mode: "refine",
  enable_pbr: true,
  ai_model: "meshy-5",
  target_formats: ["glb"],
  origin_at: "center",
};

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
      if (attempt > MAX_RETRIES) throw new Error(`Network error after ${MAX_RETRIES} retries: ${err.message}`);
      const wait = RATE_LIMIT_BACKOFF_MS * attempt;
      log(name, `network error (${err.message}); retry ${attempt}/${MAX_RETRIES} in ${wait / 1000}s`);
      await sleep(wait);
      continue;
    }

    if (res.status === 429) {
      if (attempt > MAX_RETRIES) throw new Error(`Rate limited (429) after ${MAX_RETRIES} retries`);
      const retryAfter = Number(res.headers.get("retry-after"));
      const wait = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : RATE_LIMIT_BACKOFF_MS * attempt;
      log(name, `rate limited (429); waiting ${wait / 1000}s then retry ${attempt}/${MAX_RETRIES}`);
      await sleep(wait);
      continue;
    }

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

async function createPreviewTask(name, prompt, polycount) {
  const body = { ...PREVIEW_DEFAULTS, prompt };
  if (polycount) body.target_polycount = polycount;
  const json = await api("/v2/text-to-3d", { method: "POST", body, name });
  const id = json.result;
  if (!id) throw new Error(`No task id in preview response: ${JSON.stringify(json)}`);
  log(name, `preview task created: ${id}`);
  return id;
}

async function createRefineTask(name, previewTaskId, prompt) {
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

async function download(url, destPath) {
  const res = await fetch(url); // signed URL, no auth header
  if (!res.ok) throw new Error(`download failed: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(destPath, buf);
  return buf.length;
}

// ---------------------------------------------------------------------------
// Post-processing: optimize GLB + build thumbnail
// ---------------------------------------------------------------------------

/**
 * gltf-transform optimize: quantize geometry + webp textures (max 1024px).
 * Same recipe as the first batch (31MB -> 3.5MB). Falls back to the raw file
 * if the CLI isn't available so a model is never lost to a tooling hiccup.
 */
async function optimizeGlb(name, rawPath, outPath) {
  try {
    await execFileP(
      "npx",
      ["--no-install", "gltf-transform", "optimize", rawPath, outPath,
        "--compress", "quantize", "--texture-compress", "webp", "--texture-size", "1024"],
      { shell: true, cwd: REPO_ROOT, maxBuffer: 1024 * 1024 * 32 },
    );
    const { size } = await stat(outPath);
    return { bytes: size, optimized: true };
  } catch (err) {
    log(name, `optimize failed (${String(err.message).split("\n")[0]}); keeping raw glb`);
    await copyFile(rawPath, outPath);
    const { size } = await stat(outPath);
    return { bytes: size, optimized: false };
  }
}

async function buildThumb(name, thumbUrl) {
  if (!thumbUrl) return null;
  try {
    const res = await fetch(thumbUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const dest = path.join(THUMB_DIR, `${name}.webp`);
    await sharp(buf).resize(512, 512, { fit: "cover" }).webp({ quality: 82 }).toFile(dest);
    return `/models/thumbs/${name}.webp`;
  } catch (err) {
    log(name, `thumbnail failed: ${err.message}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// One full object: preview -> refine -> download -> optimize -> thumb
// ---------------------------------------------------------------------------

async function textTo3D(entry) {
  const { name, prompt, polycount } = entry;
  const t0 = Date.now();
  log(name, "=== START ===");

  const previewId = await createPreviewTask(name, prompt, polycount);
  const preview = await pollUntilDone(previewId, name, "preview");
  const previewCredits = preview.consumed_credits ?? 0;

  const refineId = await createRefineTask(name, previewId, prompt);
  const refine = await pollUntilDone(refineId, name, "refine");
  const refineCredits = refine.consumed_credits ?? 0;

  const glbUrl = refine?.model_urls?.glb;
  if (!glbUrl) throw new Error(`No model_urls.glb on refined task: ${JSON.stringify(refine.model_urls)}`);

  const rawPath = path.join(RAW_DIR, `${name}.glb`);
  const outPath = path.join(OUTPUT_DIR, `${name}.glb`);
  const rawBytes = await download(glbUrl, rawPath);
  if (rawBytes < 20 * 1024) throw new Error(`Downloaded GLB suspiciously small (${fmtBytes(rawBytes)})`);

  const { bytes, optimized } = await optimizeGlb(name, rawPath, outPath);
  const thumb = await buildThumb(name, refine.thumbnail_url || preview.thumbnail_url);
  await rm(rawPath, { force: true });

  const totalCredits = previewCredits + refineCredits;
  const secs = ((Date.now() - t0) / 1000).toFixed(0);
  log(
    name,
    `DONE in ${secs}s -> ${fmtBytes(rawBytes)} raw -> ${fmtBytes(bytes)}${optimized ? "" : " (unoptimized)"}` +
      `${thumb ? " +thumb" : " (no thumb)"}, ~${totalCredits} cr`,
  );

  return { name, ok: true, category: entry.category, path: outPath, bytes, thumb, credits: totalCredits };
}

// ---------------------------------------------------------------------------
// Concurrency pool
// ---------------------------------------------------------------------------

async function runPool(items, worker, limit) {
  const results = new Array(items.length);
  let cursor = 0;
  async function next() {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, next));
  return results;
}

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
  await mkdir(THUMB_DIR, { recursive: true });
  await mkdir(RAW_DIR, { recursive: true });

  const args = process.argv.slice(2);
  const includeExisting = args.includes("--all");
  const named = args.filter((a) => !a.startsWith("--"));

  let queue;
  if (named.length) {
    queue = ROSTER.filter((e) => named.includes(e.name));
    if (!queue.length) {
      console.error(`No objects match: ${named.join(", ")}`);
      process.exit(1);
    }
  } else {
    queue = includeExisting ? ROSTER : NEW_ENTRIES;
  }

  const balanceBefore = await getBalance();
  log("meshy", `balance before: ${balanceBefore ?? "unknown"} credits`);
  log("meshy", `generating ${queue.length} object(s) @ concurrency ${CONCURRENCY}`);
  log("meshy", queue.map((o) => o.name).join(", "));

  const settled = await runPool(
    queue,
    async (entry) => {
      try {
        return await textTo3D(entry);
      } catch (err) {
        log(entry.name, `FAILED: ${err.message}`);
        return { name: entry.name, ok: false, category: entry.category, error: err.message };
      }
    },
    CONCURRENCY,
  );

  const results = settled.filter((r) => r.ok);
  const failures = settled.filter((r) => !r.ok);
  const balanceAfter = await getBalance();

  await writeFile(
    MANIFEST,
    JSON.stringify(
      { generatedAt: new Date().toISOString(), balanceBefore, balanceAfter, results, failures },
      null,
      2,
    ),
  );

  console.log("\n============================================================");
  console.log("MESHY MUESTRARIO GENERATION REPORT");
  console.log("============================================================");
  console.log(
    `Balance: ${balanceBefore ?? "?"} -> ${balanceAfter ?? "?"} credits` +
      (balanceBefore != null && balanceAfter != null ? ` (spent ~${balanceBefore - balanceAfter})` : ""),
  );
  console.log(`\nSUCCEEDED (${results.length}):`);
  for (const r of results) {
    console.log(`  ✓ ${r.name}  ${fmtBytes(r.bytes)}  ${r.thumb ? "thumb" : "no-thumb"}  ~${r.credits} cr`);
  }
  console.log(`\nFAILED (${failures.length}):`);
  for (const f of failures) console.log(`  ✗ ${f.name}: ${f.error}`);
  console.log(`\nManifest -> ${path.relative(REPO_ROOT, MANIFEST)}`);
  console.log("============================================================\n");

  if (results.length === 0) process.exit(1);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
