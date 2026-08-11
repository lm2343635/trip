import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the complete itinerary experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>东北自驾路线图/);
  assert.match(html, /东北自驾行程地图/);
  assert.match(html, /8\/27 · 15:00/);
  assert.match(html, /8\/28 · 12:00/);
  assert.match(html, /三陆沿岸道路 E45/);
  assert.match(html, /北山崎/);
  assert.match(html, /净土之滨/);
  assert.match(html, /碁石海岸/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SkeletonPreview/);
});

test("the interactive itinerary includes the plan's key stops and constraints", async () => {
  const [source, plan] = await Promise.all([
    readFile(new URL("../app/map-experience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../tohoku_itinerary_plan.md", import.meta.url), "utf8"),
  ]);
  const requiredDetails = [
    ["快活CLUB 盛岡上堂店", "快活CLUB 盛岡上堂店"],
    ["三陆沿岸道路（E45", "三陆沿岸道路 E45"],
    ["北山崎", "北山崎"],
    ["净土之滨", "净土之滨"],
    ["碁石海岸", "碁石海岸"],
    ["15:00", "15:00"],
    ["12:00", "12:00"],
    ["下北半岛", "下北半岛"],
    ["五色沼", "五色沼"],
    ["鸣子峡", "鸣子峡"],
  ];

  for (const [planDetail, sourceDetail] of requiredDetails) {
    assert.ok(plan.includes(planDetail), `plan should contain ${planDetail}`);
    assert.ok(source.includes(sourceDetail), `interactive site should contain ${sourceDetail}`);
  }
});

test("production CSS contains both Leaflet positioning and product layout", async () => {
  const cssRoot = new URL("../dist/client/_next/static/css/", import.meta.url);
  const files = (await readdir(cssRoot)).filter((file) => file.endsWith(".css"));
  assert.ok(files.length > 0, "expected a compiled production stylesheet");
  const css = (await Promise.all(files.map((file) => readFile(new URL(file, cssRoot), "utf8")))).join("\n");
  assert.match(css, /\.leaflet-pane/);
  assert.match(css, /\.leaflet-tile/);
  assert.match(css, /\.trip-shell/);
  assert.match(css, /\.map-workspace/);
  assert.match(css, /\.map-selection/);
});

test("all declared offline map tiles exist", async () => {
  const manifest = JSON.parse(await readFile(new URL("../public/offline-assets.json", import.meta.url), "utf8"));
  assert.equal(manifest.length, 128);
  assert.equal(new Set(manifest).size, manifest.length);
  await Promise.all(manifest.map((asset) => access(new URL(`../public/${asset.slice(1)}`, import.meta.url))));
});

test("service worker never falls back to HTML for failed assets", async () => {
  const worker = await readFile(new URL("../public/sw.js", import.meta.url), "utf8");
  assert.match(worker, /request\.mode === "navigate"/);
  assert.match(worker, /return Response\.error\(\)/);
  assert.match(worker, /self\.registration\.scope/);
  assert.equal(worker.match(/caches\.match\(HOME\)/g)?.length, 1);
});
