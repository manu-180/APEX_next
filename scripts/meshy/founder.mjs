#!/usr/bin/env node
/**
 * Meshy AI — Image-to-3D del founder (busto escultórico)
 * ------------------------------------------------------
 * Genera un busto 3D desde public/manuel.jpg vía Meshy OpenAPI v1 image-to-3d.
 *
 * Decisión de estilo: `should_texture: false` — solo geometría. El GLB se
 * renderiza en three.js con un MeshPhysicalMaterial tintado por el theme
 * (mismo tratamiento que el APEX Core), lo que da un look de escultura
 * monocromática y esquiva el uncanny valley de una textura foto-realista.
 *
 * Usage (Bash — NO PowerShell, manglea los Bearer headers):
 *   export MESHY_API_KEY=$(grep -E '^MESHY_API_KEY=' .env.local | cut -d= -f2)
 *   node scripts/meshy/founder.mjs
 *
 * Output: public/models/apex-founder.glb (crudo — optimizar después con
 * gltf-transform optimize --compress quantize --texture-compress webp).
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const API_BASE = "https://api.meshy.ai/openapi";
const API_KEY = process.env.MESHY_API_KEY;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const PHOTO = path.join(REPO_ROOT, "public", "manuel.jpg");
const OUT = path.join(REPO_ROOT, "public", "models", "apex-founder-raw.glb");

const POLL_INTERVAL_MS = 10_000;
const TASK_TIMEOUT_MS = 15 * 60_000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (msg) => console.log(`[${new Date().toISOString().slice(11, 19)}] [founder] ${msg}`);

async function api(pathname, { method = "GET", body } = {}) {
  const res = await fetch(`${API_BASE}${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(`${method} ${pathname} -> ${res.status}: ${json?.message || text}`);
  return json;
}

async function main() {
  if (!API_KEY) {
    console.error("ERROR: MESHY_API_KEY is not set.");
    process.exit(1);
  }

  const photo = await readFile(PHOTO);
  const dataUri = `data:image/jpeg;base64,${photo.toString("base64")}`;
  log(`photo loaded (${(photo.length / 1024).toFixed(0)} KB), creating image-to-3d task…`);

  const created = await api("/v1/image-to-3d", {
    method: "POST",
    body: {
      image_url: dataUri,
      ai_model: "meshy-5",
      topology: "triangle",
      target_polycount: 30_000,
      symmetry_mode: "auto",
      should_remesh: true,
      // Sin textura: el material lo pone three.js (escultura theme-reactive).
      should_texture: false,
      enable_pbr: false,
    },
  });
  const id = created.result;
  if (!id) throw new Error(`No task id: ${JSON.stringify(created)}`);
  log(`task created: ${id}`);

  const started = Date.now();
  let last = -1;
  while (true) {
    if (Date.now() - started > TASK_TIMEOUT_MS) throw new Error(`task ${id} timed out`);
    const task = await api(`/v1/image-to-3d/${id}`);
    if (task.progress !== last || task.status !== "IN_PROGRESS") {
      log(`${task.status} ${task.progress ?? 0}%`);
      last = task.progress;
    }
    if (task.status === "SUCCEEDED") {
      const url = task.model_urls?.glb;
      if (!url) throw new Error(`No glb url: ${JSON.stringify(task.model_urls)}`);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`download -> ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await mkdir(path.dirname(OUT), { recursive: true });
      await writeFile(OUT, buf);
      log(`DONE -> ${path.relative(REPO_ROOT, OUT)} (${(buf.length / 1024 / 1024).toFixed(2)} MB)`);
      return;
    }
    if (task.status === "FAILED" || task.status === "CANCELED") {
      throw new Error(`task ${id} ${task.status}: ${JSON.stringify(task.task_error)}`);
    }
    await sleep(POLL_INTERVAL_MS);
  }
}

main().catch((err) => {
  console.error("FATAL:", err.message);
  process.exit(1);
});
