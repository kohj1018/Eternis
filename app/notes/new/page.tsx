"use client";

import Editor from "@/components/Editor";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewNotePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, title, content }),
    });

    if (res.ok) {
      router.push("/notes");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-5xl mx-auto py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm">
          <div className="border-b px-8 py-6">
            <input
              type="text"
              placeholder="제목 없음"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full text-4xl font-bold border-0 outline-none placeholder-gray-300"
            />
          </div>
          <div className="min-h-[500px]">
            <Editor
              content={content}
              onChange={setContent}
              placeholder="'/'를 입력하여 명령어를 확인하세요..."
            />
          </div>
          <div className="border-t px-8 py-4 flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
