import { access, rename, rm } from "node:fs/promises";
import path from "node:path";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const prefix = basePath.replace(/^\/+|\/+$/g, "");

if (!prefix || prefix.includes("..") || prefix.includes("/")) {
  throw new Error("NEXT_PUBLIC_BASE_PATH must contain one safe repository segment");
}

const outputRoot = path.resolve("dist/client");
const prefixedRoot = path.join(outputRoot, prefix);
const sourceAssets = path.join(prefixedRoot, "_next");
const targetAssets = path.join(outputRoot, "_next");

await access(sourceAssets);
await rm(targetAssets, { recursive: true, force: true });
await rename(sourceAssets, targetAssets);
await rm(prefixedRoot, { recursive: true, force: true });
