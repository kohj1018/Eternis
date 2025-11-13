"use client";

import { AuthButton } from "@/components/AuthButton";
import { useAuth } from "@/lib/auth";

const featureList = [
  {
    title: "AI 요약 & 태깅",
    desc: "긴 노트도 핵심만 남겨 자동으로 정리하고 태그까지 붙여줍니다.",
    emoji: "✨",
    href: "/notes",
  },
  {
    title: "지식 그래프",
    desc: "연결된 아이디어를 시각화해 생각의 맥락을 잃지 않도록 도와줍니다.",
    emoji: "🕸️",
    href: "/graph",
  },
  {
    title: "리마인드",
    desc: "학습 타이밍을 추천해 자연스럽게 장기 기억을 완성합니다.",
    emoji: "📅",
    href: "/review",
  },
];

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-hero-gradient pb-24 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-14 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">Eternis</p>
            <h1 className="text-3xl font-semibold text-white">사고의 깊이를 기록하는 새로운 노트</h1>
          </div>
          <AuthButton />
        </header>

        <section className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-10 shadow-glow backdrop-blur-xl">
            <p className="mb-3 text-sm uppercase tracking-[0.35em] text-white/70">FOR THINKERS</p>
            <h2 className="mb-6 text-4xl font-semibold leading-tight">
              생각을 쓰면,
              <br />
              AI가 잇고 지식을 키워줍니다.
            </h2>
            <p className="mb-10 text-lg text-white/80">
              단순 기록이 아닌, 인사이트를 쌓는 워크플로우. AI 요약, 태깅, 망각곡선 기반 복습까지 한 번에 경험하세요.
            </p>

            <div className="flex flex-wrap gap-4">
              {user ? (
                <>
                  <a
                    href="/notes"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-soft transition hover:-translate-y-0.5"
                  >
                    내 노트로 이동
                    <span aria-hidden>↗</span>
                  </a>
                  <a
                    href="/review"
                    className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
                  >
                    오늘의 복습
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-soft transition hover:-translate-y-0.5"
                  >
                    지금 시작하기
                    <span aria-hidden>↗</span>
                  </a>
                  <a
                    href="/graph"
                    className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-base font-semibold text-white/80 transition hover:text-white"
                  >
                    라이브 데모 보기
                  </a>
                </>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/5 bg-white/5 p-6 shadow-inner backdrop-blur-3xl">
            <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/30 p-4">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>오늘의 큐</span>
                <span>{user ? "맞춤 추천" : "미리보기"}</span>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-lg font-semibold text-white">노트 연계 | 그래프 모드</p>
                  <p className="text-sm text-white/70">주요 키워드 8개 연결됨</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-lg font-semibold text-white">복습 추천</p>
                  <p className="text-sm text-white/70">Stage 3 노트 2개 남음</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-lg font-semibold text-white">AI 인사이트</p>
                  <p className="text-sm text-white/70">“AI 윤리”와 “데이터 거버넌스”의 연결성을 확인하세요.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          {featureList.map((feature) => (
            <a
              key={feature.title}
              href={feature.href}
              className="card-spotlight block overflow-hidden rounded-3xl border border-white/10 bg-white p-6 text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition hover:-translate-y-1"
            >
              <div className="text-4xl">{feature.emoji}</div>
              <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{feature.desc}</p>
            </a>
          ))}
        </section>
      </div>
    </main>
  );
}
