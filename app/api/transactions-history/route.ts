import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { OverviewQuerySchema } from "@/schema/overview";
import { prisma } from "@/lib/prisma";
import { GetFormatterForCurrency } from "@/lib/helper";

export async function GET(request: Request): Promise<Response> {
  const user = await currentUser();

  if (!user) {
    return NextResponse.redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url)
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  const queryParams = OverviewQuerySchema.safeParse({
    from: from ? new Date(from) : null,
    to: to ? new Date(to) : null,
  });

  if (!queryParams.success) {
    return NextResponse.json({ error: queryParams.error.format(), status: 400 })
  };

  const transaction = await getTransactionHistory(
    user.id,
    queryParams.data.from,
    queryParams.data.to,
  )

  return NextResponse.json(transaction, { status: 200 });
}

export type getTransactionHistoryResponseType = Awaited<
  ReturnType<typeof getTransactionHistory>
>

async function getTransactionHistory(userId: string, from: Date, to: Date) {
  const userSetting = await prisma.userSettings.findUnique({
    where: {
      userId,
    },
  });
  if (!userSetting) {
    throw new Error("user settings not found")
  }

  const formatter = GetFormatterForCurrency(userSetting.currency);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: "desc"
    },
  });

  return transactions.map(transactions => ({
    ...transactions,
    formattedAmount: formatter.format(transactions.amount),
  }))
} 