"use client";

import Navigation from "@/components/Navigation";
import { SkeletonReviewCard } from "@/components/SkeletonCard";
import { useAuth } from "@/lib/auth";
import { useDelayedLoading } from "@/lib/useDelayedLoading";
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
  const showSkeleton = useDelayedLoading(loading || fetching);

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

  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navigation />
      <div className="mx-auto max-w-6xl px-6 py-12 text-white">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Spaced Repetition</p>
          <h1 className="mt-2 text-4xl font-semibold">오늘의 복습</h1>
          <p className="mt-2 text-sm text-white/70">망각곡선에 따라 맞춤 추천된 노트들입니다.</p>
        </div>
        {showSkeleton ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <SkeletonReviewCard key={i} />
            ))}
          </div>
        ) : schedules.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 py-20 text-center text-white/70">
            오늘 복습할 노트가 없습니다! 🎉
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 text-slate-900 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                      Stage {schedule.stage}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold">{schedule.note.title}</h3>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    Due {new Date(schedule.nextReviewDate).toLocaleDateString()}
                  </span>
                </div>
                {schedule.note.summary && (
                  <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-slate-500">요약</p>
                    <p className="mt-1 text-sm text-slate-700">{schedule.note.summary}</p>
                  </div>
                )}
                {schedule.note.tags && schedule.note.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {schedule.note.tags.map((tag) => (
                      <span key={tag.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-6 flex gap-2">
                  <button
                    type="button"
                    onClick={() => router.push(`/notes/${schedule.note.id}`)}
                    className="flex-1 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
                  >
                    노트 보기
                  </button>
                  <button
                    type="button"
                    onClick={() => handleComplete(schedule.id)}
                    className="flex-1 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
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
