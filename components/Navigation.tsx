"use client";

import { AuthButton } from "@/components/AuthButton";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/notes", label: "노트" },
  { href: "/graph", label: "그래프" },
  { href: "/review", label: "복습" },
];

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-surface/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold text-white shadow-soft">
            E
          </div>
          <div>
            <p className="text-lg font-semibold text-white">Eternis</p>
            <p className="text-xs uppercase tracking-[0.3em] text-white/80">Notes</p>
          </div>
        </a>

        <nav className="flex flex-1 items-center justify-end gap-2 text-sm font-medium text-slate-300">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-2 rounded-full px-4 py-2 transition ${
                isActive(item.href)
                  ? "bg-white/20 text-white shadow-soft"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>{item.label}</span>
              {isActive(item.href) && <span className="h-1.5 w-1.5 rounded-full bg-brand"></span>}
            </a>
          ))}
          <button
            type="button"
            onClick={() => router.push("/notes/new")}
            className="ml-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand via-brand-dark to-brand px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:translate-y-0.5"
          >
            + 새 노트
          </button>
          <AuthButton />
        </nav>
      </div>
    </header>
  );
}

