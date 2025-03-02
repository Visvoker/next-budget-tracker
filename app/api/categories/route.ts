import { z } from "zod";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: Request): Promise<Response> {
  const user = await currentUser();
  if (!user) {
    return NextResponse.redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const paramType = searchParams.get("type");

  const validator = z.enum(["expense", "income"]).optional();
  const queryParams = validator.safeParse(paramType);
  if (!queryParams.success) {
    return NextResponse.json({ error: queryParams.error.errors }, { status: 400 })
  }

  const type = queryParams.data;
  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
      type: type || undefined,
    },
    orderBy: { name: "asc" },
  });

  return Response.json(categories);
}