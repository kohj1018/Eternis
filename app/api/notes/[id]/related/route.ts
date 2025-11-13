import { prisma } from "@/lib/db";
import { cosineSimilarity } from "@/lib/vector";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // 현재 노트의 임베딩 가져오기
  const currentNote = await prisma.note.findUnique({
    where: { id },
    include: { embedding: true },
  });

  if (!currentNote?.embedding) {
    return NextResponse.json([]);
  }

  // 임베딩 벡터를 변수에 할당하여 타입 확정
  const currentEmbedding = currentNote.embedding.vector;

  // 같은 사용자의 모든 노트 가져오기
  const allNotes = await prisma.note.findMany({
    where: {
      userId: currentNote.userId,
      id: { not: id },
    },
    include: {
      embedding: true,
      tags: true,
    },
  });

  // 유사도 계산
  const notesWithSimilarity = allNotes
    .filter((note) => note.embedding?.vector)
    .map((note) => ({
      ...note,
      similarity: cosineSimilarity(
        currentEmbedding,
        note.embedding?.vector ?? [],
      ),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5);

  return NextResponse.json(notesWithSimilarity);
}
