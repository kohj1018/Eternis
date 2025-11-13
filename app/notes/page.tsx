"use client";

import Navigation from "@/components/Navigation";
import { SkeletonCard } from "@/components/SkeletonCard";
import { useAuth } from "@/lib/auth";
import { useDelayedLoading } from "@/lib/useDelayedLoading";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  createdAt: string;
  tags?: { id: string; name: string }[];
}

export default function NotesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [fetching, setFetching] = useState(false);
  const showSkeleton = useDelayedLoading(loading || fetching);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (user) {
      fetchNotes();
    }
  }, [user, loading, router]);

  const fetchNotes = async () => {
    setFetching(true);
    try {
      const res = await fetch(`/api/notes?userId=${user?.id}`);
      if (!res.ok) {
        const error = await res.json();
        console.error("Failed to fetch notes:", error);
        setNotes([]);
        return;
      }
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error("Fetch error:", error);
      setNotes([]);
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navigation />
      <div className="mx-auto max-w-6xl px-6 py-12 text-white">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Library</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">내 노트</h1>
            <p className="mt-2 text-sm text-white/70">
              {notes.length === 0 ? "새로운 아이디어를 기록해보세요." : `총 ${notes.length}개의 노트`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/notes/new")}
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            + 새 노트 작성
          </button>
        </div>

        {showSkeleton ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 py-20 text-center text-white/70">
            아직 노트가 없습니다. 새 노트를 작성해보세요!
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <button
                type="button"
                key={note.id}
                onClick={() => router.push(`/notes/${note.id}`)}
                className="card-spotlight text-left"
              >
                <div className="h-full overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 text-slate-900 shadow-[0_25px_60px_rgba(15,23,42,0.08)] transition hover:-translate-y-1">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">{note.title}</h3>
                    {note.createdAt && (
                      <span className="text-xs text-slate-400">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-slate-600 line-clamp-4">{note.summary || note.content}</p>
                  {note.tags && note.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {note.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
