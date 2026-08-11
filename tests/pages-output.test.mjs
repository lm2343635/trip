import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const outputRoot = new URL("../dist/client/", import.meta.url);

test("GitHub Pages export contains a complete base-path-aware site", async () => {
  const html = await readFile(new URL("index.html", outputRoot), "utf8");
  assert.match(html, /<title>东北自驾路线图/);
  assert.match(html, /东北自驾行程地图/);
  assert.match(html, /(?:src|href)=["']\/trip\/_next\//);
  assert.match(html, /href=["']\/trip\/manifest\.webmanifest/);
  assert.doesNotMatch(html, /(?:src|href)=["']\/_next\//);

  await Promise.all([
    access(new URL(".nojekyll", outputRoot)),
    access(new URL("sw.js", outputRoot)),
    access(new URL("tiles/std/7/113/48.png", outputRoot)),
  ]);

  const cssFiles = (await readdir(new URL("_next/static/css/", outputRoot))).filter((name) => name.endsWith(".css"));
  assert.ok(cssFiles.length > 0, "expected compiled CSS in the Pages artifact");

  const chunkNames = (await readdir(new URL("_next/static/chunks/", outputRoot))).filter((name) => name.endsWith(".js"));
  const chunks = (await Promise.all(chunkNames.map((name) => readFile(new URL(`_next/static/chunks/${name}`, outputRoot), "utf8")))).join("\n");
  assert.match(chunks, /[`"']\/trip[`"']/);
  assert.match(chunks, /\/sw\.js/);
  assert.match(chunks, /\/tiles\/std/);
});
