import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const note = await prisma.note.findUnique({
    where: { id },
    include: {
      tags: true,
      reviewSchedules: {
        where: { completed: false },
        orderBy: { nextReviewDate: "asc" },
      },
    },
  });

  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  return NextResponse.json(note);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await prisma.note.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { title, content } = body;

  const note = await prisma.note.update({
    where: { id },
    data: { title, content },
  });

  return NextResponse.json(note);
}
