import type { Metadata } from "next";
import { MapExperience } from "./map-experience";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "东北自驾路线图 · 8/23–8/29",
  description: "可缩放、可离线查看的日本东北自驾行程地图。",
};

export default function Home() {
  return <MapExperience />;
}
