/* eslint-disable @next/next/no-css-tags -- Vite development needs direct CSS responses for linked stylesheets. */
import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { withBasePath } from "./base-path";

export const metadata: Metadata = {
  title: "东北自驾路线图",
  description: "8/23–8/29 日本东北自驾行程离线地图",
  manifest: withBasePath("/manifest.webmanifest"),
  icons: {
    icon: withBasePath("/favicon.svg"),
    shortcut: withBasePath("/favicon.svg"),
  },
  openGraph: {
    title: "东北自驾路线图",
    description: "8/23–8/29 · 东京至青森，再沿三陆海岸返回",
    type: "website",
    images: [{ url: withBasePath("/og-v2.png"), width: 1731, height: 909, alt: "东北自驾行程地图" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "东北自驾路线图",
    description: "8/23–8/29 · 东京至青森，再沿三陆海岸返回",
    images: [withBasePath("/og-v2.png")],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      {process.env.NODE_ENV === "development" && (
        <head>
          <link rel="stylesheet" href="/node_modules/leaflet/dist/leaflet.css?direct" />
          <link rel="stylesheet" href="/app/globals.css?direct" />
        </head>
      )}
      <body>{children}</body>
    </html>
  );
}
