"use client";

import Navigation from "@/components/Navigation";
import { useAuth } from "@/lib/auth";
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

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">내 노트</h1>
        {notes.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            아직 노트가 없습니다. 새 노트를 작성해보세요!
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <button
                type="button"
                key={note.id}
                onClick={() => router.push(`/notes/${note.id}`)}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer transition text-left"
              >
                <h3 className="font-bold text-lg mb-2">{note.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                  {note.summary || note.content}
                </p>
                {note.tags && note.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {note.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
