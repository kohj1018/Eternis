"use client";

import { AuthButton } from "@/components/AuthButton";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Eternis</h1>
          <AuthButton />
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {user ? (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <a
                href="/notes"
                className="block p-8 bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <div className="text-4xl mb-4">📝</div>
                <h2 className="text-2xl font-bold mb-2">내 노트</h2>
                <p className="text-gray-600">
                  AI가 자동으로 요약하고 태그를 붙여줍니다
                </p>
              </a>
              <a
                href="/review"
                className="block p-8 bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <div className="text-4xl mb-4">📚</div>
                <h2 className="text-2xl font-bold mb-2">오늘의 복습</h2>
                <p className="text-gray-600">
                  망각곡선에 따라 최적의 타이밍에 복습하세요
                </p>
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold mb-4">
              AI와 함께하는 스마트 노트
            </h2>
            <p className="text-gray-600 mb-8">
              노트를 작성하면 AI가 자동으로 요약하고, 망각곡선에 따라 복습을
              도와줍니다.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
