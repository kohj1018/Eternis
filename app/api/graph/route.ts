import { prisma } from "@/lib/db";
import { cosineSimilarity } from "@/lib/vector";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    // 사용자의 모든 노트 가져오기
    const notes = await prisma.note.findMany({
      where: { userId },
      include: {
        tags: true,
        embedding: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // 노트가 2개 미만이면 그래프 생성 불가
    if (notes.length < 2) {
      return NextResponse.json({ nodes: notes, edges: [] });
    }

    // 노드 데이터
    const nodes = notes.map((note) => ({
      id: note.id,
      title: note.title,
      tags: note.tags,
    }));

    // 엣지 데이터 (유사도 계산)
    const edges: Array<{
      source: string;
      target: string;
      similarity: number;
    }> = [];

    for (let i = 0; i < notes.length; i++) {
      for (let j = i + 1; j < notes.length; j++) {
        const note1 = notes[i];
        const note2 = notes[j];

        // 둘 다 임베딩이 있는 경우만 계산
        if (note1.embedding?.vector && note2.embedding?.vector) {
          const similarity = cosineSimilarity(
            note1.embedding.vector,
            note2.embedding.vector,
          );

          // 유사도가 일정 수준 이상인 경우만 엣지로 추가
          if (similarity > 0.5) {
            edges.push({
              source: note1.id,
              target: note2.id,
              similarity,
            });
          }
        }
      }
    }

    return NextResponse.json({ nodes, edges });
  } catch (error) {
    console.error("Graph API error:", error);
    return NextResponse.json(
      { error: "Failed to generate graph" },
      { status: 500 },
    );
  }
}

