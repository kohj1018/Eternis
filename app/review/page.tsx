"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ReviewSchedule {
  id: string;
  stage: number;
  nextReviewDate: string;
  note: {
    id: string;
    title: string;
    summary?: string;
    content: string;
    tags?: { id: string; name: string }[];
  };
}

export default function ReviewPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [schedules, setSchedules] = useState<ReviewSchedule[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (user) {
      fetchReviews();
    }
  }, [user, loading, router]);

  const fetchReviews = async () => {
    setFetching(true);
    const res = await fetch(`/api/review?userId=${user?.id}`);
    const data = await res.json();
    setSchedules(data);
    setFetching(false);
  };

  const handleComplete = async (scheduleId: string) => {
    await fetch(`/api/review/${scheduleId}/complete`, {
      method: "POST",
    });
    fetchReviews();
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold">
            Eternis
          </a>
          <div className="flex gap-4">
            <a
              href="/notes"
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              노트
            </a>
            <a href="/review" className="px-4 py-2 text-blue-600 font-medium">
              복습
            </a>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">오늘의 복습</h1>
        <p className="text-gray-600 mb-8">
          망각곡선에 따라 복습이 필요한 노트들입니다.
        </p>
        {schedules.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            오늘 복습할 노트가 없습니다! 🎉
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="text-sm text-blue-600 mb-1">
                      Stage {schedule.stage} 복습
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      {schedule.note.title}
                    </h3>
                  </div>
                </div>
                {schedule.note.summary && (
                  <div className="bg-gray-50 p-3 rounded mb-4">
                    <div className="text-sm font-semibold mb-1">요약</div>
                    <p className="text-sm text-gray-700">
                      {schedule.note.summary}
                    </p>
                  </div>
                )}
                {schedule.note.tags && schedule.note.tags.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {schedule.note.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => router.push(`/notes/${schedule.note.id}`)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    노트 보기
                  </button>
                  <button
                    type="button"
                    onClick={() => handleComplete(schedule.id)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    복습 완료
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
