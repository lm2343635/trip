import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "东北自驾路线图",
  description: "8/23–8/29 日本东北自驾行程离线地图",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "东北自驾路线图",
    description: "8/23–8/29 · 东京至青森，再沿三陆海岸返回",
    type: "website",
    images: [{ url: "/og-v2.png", width: 1731, height: 909, alt: "东北自驾行程地图" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "东北自驾路线图",
    description: "8/23–8/29 · 东京至青森，再沿三陆海岸返回",
    images: ["/og-v2.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
