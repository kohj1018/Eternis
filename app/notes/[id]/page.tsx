"use client";

import Navigation from "@/components/Navigation";
import { useAuth } from "@/lib/auth";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  tags?: { id: string; name: string }[];
  reviewSchedules?: {
    id: string;
    nextReviewDate: string;
    stage: number;
  }[];
}

interface RelatedNote {
  id: string;
  title: string;
  summary?: string;
  similarity: number;
}

export default function NoteDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [relatedNotes, setRelatedNotes] = useState<RelatedNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchNote();
      fetchRelatedNotes();
    }
  }, [params.id]);

  const fetchNote = async () => {
    const res = await fetch(`/api/notes/${params.id}`);
    const data = await res.json();
    setNote(data);
    setLoading(false);
  };

  const fetchRelatedNotes = async () => {
    const res = await fetch(`/api/notes/${params.id}/related`);
    const data = await res.json();
    setRelatedNotes(data);
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    await fetch(`/api/notes/${params.id}`, {
      method: "DELETE",
    });
    router.push("/notes");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>노트를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_50%),_#030712]">
      <Navigation />
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 text-slate-900 shadow-[0_30px_80px_rgba(2,6,23,0.25)]">
          <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Note Detail</p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-900">{note.title}</h1>
              <div className="mt-4 flex flex-wrap gap-2">
                {note.tags?.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            >
              삭제
            </button>
          </div>

          {note.summary && (
            <div className="mb-8 rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">요약</h3>
              <p className="mt-3 text-base text-slate-700">{note.summary}</p>
            </div>
          )}

          <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 text-slate-900 shadow-inner">
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: note.content }}
            />
          </article>

          {note.reviewSchedules && note.reviewSchedules.length > 0 && (
            <div className="mt-10 rounded-2xl border border-slate-100 bg-white p-6 text-slate-900 shadow-inner">
              <h3 className="mb-4 text-lg font-semibold text-slate-800">📅 복습 일정</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {note.reviewSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    Stage {schedule.stage} · {new Date(schedule.nextReviewDate).toLocaleDateString()}
                  </div>
                ))}
              </div>
            </div>
          )}

          {relatedNotes.length > 0 && (
            <div className="mt-10 rounded-2xl border border-slate-100 bg-white p-6 text-slate-900 shadow-inner">
              <h3 className="text-slate-700">🔗 연관된 노트</h3>
              <div className="mt-4 space-y-3">
                {relatedNotes.map((related) => (
                  <button
                    type="button"
                    key={related.id}
                    onClick={() => router.push(`/notes/${related.id}`)}
                    className="w-full overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 text-left text-slate-900 shadow-[0_10px_35px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5"
                  >
                    <div className="font-semibold">{related.title}</div>
                    {related.summary && (
                      <p className="mt-1 text-sm text-slate-500 line-clamp-2">{related.summary}</p>
                    )}
                    <div className="mt-2 text-xs font-semibold text-brand-dark">
                      유사도 {(related.similarity * 100).toFixed(1)}%
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
