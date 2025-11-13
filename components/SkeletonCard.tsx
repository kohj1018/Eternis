"use client";

export function SkeletonCard() {
  return (
    <div className="h-full rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between">
        <div className="h-6 w-3/4 animate-pulse rounded-lg bg-slate-200/60" />
        <div className="h-4 w-16 animate-pulse rounded bg-slate-200/60" />
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-slate-200/60" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200/60" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200/60" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200/60" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200/60" />
      </div>
    </div>
  );
}

export function SkeletonReviewCard() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-1 h-4 w-24 animate-pulse rounded bg-slate-200/60" />
          <div className="mb-2 h-7 w-3/4 animate-pulse rounded-lg bg-slate-200/60" />
        </div>
      </div>
      <div className="mb-4 rounded-2xl bg-slate-50/80 p-3">
        <div className="mb-1 h-4 w-12 animate-pulse rounded bg-slate-200/60" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200/60" />
      </div>
      <div className="mb-4 flex gap-2">
        <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200/60" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200/60" />
      </div>
      <div className="flex gap-2">
        <div className="h-10 flex-1 animate-pulse rounded-xl bg-slate-200/60" />
        <div className="h-10 flex-1 animate-pulse rounded-xl bg-slate-200/60" />
      </div>
    </div>
  );
}

export function SkeletonLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-brand" />
        <p className="mt-4 text-sm text-slate-500">로딩 중...</p>
      </div>
    </div>
  );
}

