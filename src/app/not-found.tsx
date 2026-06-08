import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "页面不存在" };

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-9xl font-bold text-gray-100 select-none leading-none">404</p>
      <h1 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">页面不存在</h1>
      <p className="text-gray-400 mb-8 text-sm">
        您访问的页面已被删除或从未存在。
      </p>
      <Link
        href="/"
        className="bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
      >
        返回首页
      </Link>
    </div>
  );
}
