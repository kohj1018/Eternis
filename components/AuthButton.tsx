"use client";

import { useAuth } from "@/lib/auth";

export function AuthButton() {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <a
        href="/login"
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        로그인
      </a>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600">{user.email}</span>
      <button
        type="button"
        onClick={signOut}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        로그아웃
      </button>
    </div>
  );
}
