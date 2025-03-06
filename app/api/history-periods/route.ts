import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request): Promise<Response> {
  const user = await currentUser();
  if (!user) {
    return NextResponse.redirect("/sign-in");
  }

  const periods = await getHistoryPeriods(user.id);
  return NextResponse.json(periods);

}

export type GetHistoryPeriodsResponseType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;

async function getHistoryPeriods(userId: string) {
  const result = await prisma.monthHistory.findMany({
    where: {
      userId,
    },
    select: {
      year: true,
    },
    distinct: ["year"],
    orderBy: [
      {
        year: "asc",
      },
    ],
  });

  const years = result.map((el) => el.year);
  if (years.length === 0) {
    return [new Date().getFullYear()]
  }

  return years;
}
