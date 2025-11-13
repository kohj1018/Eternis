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
    <div className="min-h-screen bg-hero-gradient">
      <Navigation />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-100 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)]"
        >
          <div className="border-b border-slate-100 px-8 py-6">
            <label htmlFor="note-title" className="sr-only">
              제목
            </label>
            <input
              id="note-title"
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border-0 bg-transparent text-4xl font-semibold text-slate-900 placeholder:text-slate-300 focus:outline-none"
            />
          </div>
          <div className="px-2 pb-6 pt-4">
            <Editor
              content={content}
              onChange={setContent}
              placeholder="'/'를 입력하여 명령어를 확인하세요..."
            />
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-100 px-8 py-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
