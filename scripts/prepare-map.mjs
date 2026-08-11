import fs from "node:fs";

const source = "/private/tmp/japan-prefectures.geojson";
const destination = new URL("../app/tohoku-geojson.json", import.meta.url);
const keep = new Set([
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "新潟県",
  "群馬県",
  "栃木県",
  "茨城県",
  "埼玉県",
  "東京都",
  "千葉県",
]);

function perpendicularDistance(point, start, end) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  if (dx === 0 && dy === 0) return Math.hypot(point[0] - start[0], point[1] - start[1]);
  const t = Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(point[0] - (start[0] + t * dx), point[1] - (start[1] + t * dy));
}

function simplifyLine(points, tolerance = 0.004) {
  if (points.length <= 4) return points;
  const closed = points[0][0] === points.at(-1)[0] && points[0][1] === points.at(-1)[1];
  const line = closed ? points.slice(0, -1) : points.slice();
  if (line.length <= 3) return points;
  const keepPoint = new Uint8Array(line.length);
  keepPoint[0] = 1;
  keepPoint[line.length - 1] = 1;
  const stack = [[0, line.length - 1]];
  while (stack.length) {
    const [startIndex, endIndex] = stack.pop();
    let maxDistance = 0;
    let splitIndex = -1;
    for (let index = startIndex + 1; index < endIndex; index += 1) {
      const distance = perpendicularDistance(line[index], line[startIndex], line[endIndex]);
      if (distance > maxDistance) {
        maxDistance = distance;
        splitIndex = index;
      }
    }
    if (maxDistance > tolerance && splitIndex > 0) {
      keepPoint[splitIndex] = 1;
      stack.push([startIndex, splitIndex], [splitIndex, endIndex]);
    }
  }
  const simplified = line.filter((_, index) => keepPoint[index]).map(([lon, lat]) => [Number(lon.toFixed(4)), Number(lat.toFixed(4))]);
  if (closed) simplified.push(simplified[0]);
  return simplified;
}

function ringArea(ring) {
  let area = 0;
  for (let index = 0; index < ring.length - 1; index += 1) {
    area += ring[index][0] * ring[index + 1][1] - ring[index + 1][0] * ring[index][1];
  }
  return area / 2;
}

function simplifyGeometry(geometry) {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  const simplified = polygons
    .map((polygon) => polygon.map((ring) => simplifyLine(ring)).filter((ring) => ring.length >= 4))
    .filter((polygon) => polygon.length && Math.abs(ringArea(polygon[0])) > 0.00005)
    .map((polygon) => polygon.map((ring, index) => {
      const area = ringArea(ring);
      const shouldReverse = index === 0 ? area > 0 : area < 0;
      return shouldReverse ? ring.toReversed() : ring;
    }));
  return { type: "MultiPolygon", coordinates: simplified };
}

const input = JSON.parse(fs.readFileSync(source, "utf8"));
const output = {
  type: "FeatureCollection",
  features: input.features
    .filter((feature) => keep.has(feature.properties.P))
    .map((feature) => ({
      type: "Feature",
      properties: { name: feature.properties.P },
      geometry: simplifyGeometry(feature.geometry),
    })),
};

fs.writeFileSync(destination, `${JSON.stringify(output)}\n`);
console.log(`Wrote ${output.features.length} prefectures to ${destination.pathname}`);
