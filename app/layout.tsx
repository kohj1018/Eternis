import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eternis - Smart Note Taking",
  description: "AI-powered note taking with spaced repetition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
