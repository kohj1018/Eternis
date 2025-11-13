"use client";

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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/notes" className="text-2xl font-bold">
            Eternis
          </a>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            삭제
          </button>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">{note.title}</h1>
        {note.summary && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">📝 요약</h3>
            <p className="text-gray-700">{note.summary}</p>
          </div>
        )}
        {note.tags && note.tags.length > 0 && (
          <div className="flex gap-2 mb-6">
            {note.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap">{note.content}</p>
        </div>
        {note.reviewSchedules && note.reviewSchedules.length > 0 && (
          <div className="mt-8 bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">📅 복습 일정</h3>
            <div className="space-y-2">
              {note.reviewSchedules.map((schedule) => (
                <div key={schedule.id} className="text-sm text-gray-700">
                  Stage {schedule.stage}:{" "}
                  {new Date(schedule.nextReviewDate).toLocaleDateString()}
                </div>
              ))}
            </div>
          </div>
        )}
        {relatedNotes.length > 0 && (
          <div className="mt-8 bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">🔗 연관된 노트</h3>
            <div className="space-y-2">
              {relatedNotes.map((related) => (
                <button
                  type="button"
                  key={related.id}
                  onClick={() => router.push(`/notes/${related.id}`)}
                  className="block w-full text-left p-3 bg-white rounded hover:bg-gray-50 transition"
                >
                  <div className="font-medium">{related.title}</div>
                  {related.summary && (
                    <div className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {related.summary}
                    </div>
                  )}
                  <div className="text-xs text-purple-600 mt-1">
                    유사도: {(related.similarity * 100).toFixed(1)}%
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
