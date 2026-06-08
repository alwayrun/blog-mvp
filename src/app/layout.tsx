import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: "Blog", template: "%s | Blog" },
  description: "探索前端技术文章，涵盖 Next.js、TypeScript、React 等现代 Web 开发话题。",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "Blog",
  },
  twitter: { card: "summary" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-white text-gray-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
