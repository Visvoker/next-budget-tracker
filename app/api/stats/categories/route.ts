import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { OverviewQuerySchema } from "@/schema/overview";
import { prisma } from "@/lib/prisma";


export async function GET(request: Request): Promise<Response> {
  const user = await currentUser();
  if (!user) {
    return NextResponse.redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({
    from: from ? new Date(from) : null,
    to: to ? new Date(to) : null,
  });

  if (!queryParams.success) {
    return NextResponse.json(
      { error: queryParams.error.format() },
      { status: 400 }
    );
  }

  const stats = await getCategoriesStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to,
  );
  return NextResponse.json(stats);
}

export type getCategoriesStatsResponseType = Awaited<ReturnType<typeof getCategoriesStats>>

const getCategoriesStats = async (
  userId: string,
  from: Date,
  to: Date,
) => {
  const stats = await prisma.transaction.groupBy({
    by: ["type", "category", "categoryIcon"],
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  return stats;
}