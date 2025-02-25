import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server"


export async function GET(): Promise<Response> {
  const user = await currentUser();

  if (!user) {
    return NextResponse.redirect("/sign-in");
  }
  let userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    userSettings = await prisma.userSettings.create({
      data: {
        userId: user.id,
        currency: "USD",
      },
    });
  }

  revalidatePath("/");
  return NextResponse.json(userSettings);
}