"use client";

import { useAuth } from "@/lib/auth";

export function AuthButton() {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <a
        href="/login"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-dark px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        로그인
        <span aria-hidden className="text-base leading-none">↗</span>
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/80 px-3 py-1.5 text-sm text-slate-600 shadow-soft backdrop-blur">
      <span className="hidden text-xs uppercase tracking-[0.2em] text-slate-500 sm:block">Signed in</span>
      <span className="font-medium text-slate-800">{user.email}</span>
      <button
        type="button"
        onClick={signOut}
        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-brand hover:text-brand"
      >
        로그아웃
      </button>
    </div>
  );
}
