import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { OverviewQuerySchema } from "@/schema/overview";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request): Promise<Response> {
  const user = await currentUser()
  if (!user) {
    return NextResponse.redirect("/sign-in", 307)
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

  const stats = await getBalanceStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to,
  );

  return NextResponse.json(stats);
}

export type GetBalanceStatsResponseType = Awaited<ReturnType<typeof getBalanceStats>>

const getBalanceStats = async (userId: string, from: Date, to: Date) => {
  const totals = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      userId: userId ?? "",
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
  });

  return {
    expense: totals.find((t) => t.type === "expense")?._sum.amount || 0,
    income: totals.find((t) => t.type === "income")?._sum.amount || 0,
  };
}