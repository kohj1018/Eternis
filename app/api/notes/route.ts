import { generateEmbedding, generateSummaryAndTags } from "@/lib/ai";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const notes = await prisma.note.findMany({
      where: { userId },
      include: {
        tags: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("GET /api/notes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes", details: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, title, content } = body;

    if (!userId || !title || !content) {
      return NextResponse.json(
        { error: "userId, title, content required" },
        { status: 400 },
      );
    }

    // AI 요약 및 태그 생성
    const { summary, tags } = await generateSummaryAndTags(content);

    // 임베딩 생성
    const embedding = await generateEmbedding(`${title}\n${content}`);

    // 노트 생성
    const note = await prisma.note.create({
      data: {
        userId,
        title,
        content,
        summary,
        tags: {
          create: tags.map((tag) => ({ name: tag })),
        },
        embedding:
          embedding.length > 0 ? { create: { vector: embedding } } : undefined,
      },
      include: {
        tags: true,
      },
    });

    // 복습 스케줄 생성 (3, 7, 14, 30일)
    const reviewDays = [3, 7, 14, 30];
    await prisma.reviewSchedule.createMany({
      data: reviewDays.map((days, index) => ({
        noteId: note.id,
        nextReviewDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
        stage: index + 1,
      })),
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error("POST /api/notes error:", error);
    return NextResponse.json(
      { error: "Failed to create note", details: String(error) },
      { status: 500 },
    );
  }
}
