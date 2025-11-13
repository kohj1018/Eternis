import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const schedules = await prisma.reviewSchedule.findMany({
    where: {
      note: { userId },
      completed: false,
      nextReviewDate: {
        gte: today,
        lt: tomorrow,
      },
    },
    include: {
      note: {
        include: {
          tags: true,
        },
      },
    },
    orderBy: {
      nextReviewDate: "asc",
    },
  });

  return NextResponse.json(schedules);
}
