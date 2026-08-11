import fs from "node:fs/promises";
import path from "node:path";

const bounds = { west: 138.2, south: 35.25, east: 142.55, north: 41.35 };
const zooms = [5, 6, 7, 8, 9];
const root = new URL("../public/tiles/std/", import.meta.url);

function lonToTile(lon, zoom) {
  return Math.floor(((lon + 180) / 360) * 2 ** zoom);
}

function latToTile(lat, zoom) {
  const radians = (lat * Math.PI) / 180;
  return Math.floor(((1 - Math.asinh(Math.tan(radians)) / Math.PI) / 2) * 2 ** zoom);
}

const jobs = [];
for (const zoom of zooms) {
  const minX = lonToTile(bounds.west, zoom);
  const maxX = lonToTile(bounds.east, zoom);
  const minY = latToTile(bounds.north, zoom);
  const maxY = latToTile(bounds.south, zoom);
  for (let x = minX; x <= maxX; x += 1) {
    for (let y = minY; y <= maxY; y += 1) jobs.push({ zoom, x, y });
  }
}

let cursor = 0;
async function worker() {
  while (cursor < jobs.length) {
    const job = jobs[cursor++];
    const directory = path.join(root.pathname, String(job.zoom), String(job.x));
    const file = path.join(directory, `${job.y}.png`);
    await fs.mkdir(directory, { recursive: true });
    try {
      await fs.access(file);
      continue;
    } catch {
      // The tile is not present locally yet; download it below.
    }
    const url = `https://cyberjapandata.gsi.go.jp/xyz/std/${job.zoom}/${job.x}/${job.y}.png`;
    const response = await fetch(url, { headers: { "User-Agent": "tohoku-trip-offline-map/1.0" } });
    if (!response.ok) throw new Error(`${response.status} ${url}`);
    await fs.writeFile(file, Buffer.from(await response.arrayBuffer()));
  }
}

await Promise.all(Array.from({ length: 8 }, worker));
const assets = jobs.map(({ zoom, x, y }) => `/tiles/std/${zoom}/${x}/${y}.png`);
await fs.writeFile(new URL("../public/offline-assets.json", import.meta.url), `${JSON.stringify(assets)}\n`);
console.log(`Downloaded ${assets.length} local GSI tiles.`);
