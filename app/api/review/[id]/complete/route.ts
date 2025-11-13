import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  await prisma.reviewSchedule.update({
    where: { id },
    data: {
      completed: true,
      completedAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
