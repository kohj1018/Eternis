"use client";

import { usePathname, useRouter } from "next/navigation";

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/");
  };

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/notes" className="text-2xl font-bold">
          Eternis
        </a>
        <div className="flex gap-6 items-center">
          <a
            href="/notes"
            className={`px-3 py-2 rounded-lg transition ${
              isActive("/notes")
                ? "text-blue-600 font-medium bg-blue-50"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            노트
          </a>
          <a
            href="/graph"
            className={`px-3 py-2 rounded-lg transition ${
              isActive("/graph")
                ? "text-blue-600 font-medium bg-blue-50"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            그래프
          </a>
          <a
            href="/review"
            className={`px-3 py-2 rounded-lg transition ${
              isActive("/review")
                ? "text-blue-600 font-medium bg-blue-50"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            복습
          </a>
          <button
            type="button"
            onClick={() => router.push("/notes/new")}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            + 새 노트
          </button>
        </div>
      </div>
    </nav>
  );
}

