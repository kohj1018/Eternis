"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState("");
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const { error } = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password);

    if (error) {
      setMessage(error.message);
    } else {
      if (isSignUp) {
        setMessage("회원가입 완료! 이메일 인증 후 로그인해주세요.");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient px-6 py-12 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-3xl border border-white/15 bg-white/10 p-6 shadow-lg backdrop-blur md:flex-row">
        <div className="flex flex-1 flex-col justify-between rounded-2xl border border-white/10 bg-white/10 p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Eternis</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight">
              {isSignUp ? "새로운 기록을 시작해볼까요?" : "이어서 작성해보세요."}
            </h1>
            <p className="mt-4 text-white/80">
              AI가 요약하고 연결해주는 노트, 망각곡선 복습까지 한번에 경험하세요.
            </p>
          </div>
          <div className="mt-10 space-y-2 text-sm text-white/70">
            <p>• AI 요약 & 태깅 자동화</p>
            <p>• 지식 그래프 시각화</p>
            <p>• Stage 기반 복습 리마인더</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-8 text-slate-900 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Eternis</h2>
            <p className="mt-2 text-sm text-slate-500">
              {isSignUp ? "새 계정을 생성하고 시작하기" : "계정에 로그인하여 계속"}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-600">
                이메일
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-600">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            {message && <p className="text-sm text-rose-600">{message}</p>}
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-brand to-brand-dark px-4 py-3 text-sm font-semibold text-white shadow-glow transition hover:opacity-95"
            >
              {isSignUp ? "회원가입" : "로그인"}
            </button>
          </form>
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-semibold text-brand-dark hover:text-brand"
            >
              {isSignUp ? "이미 계정이 있으신가요? 로그인" : "계정이 없으신가요? 회원가입"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
