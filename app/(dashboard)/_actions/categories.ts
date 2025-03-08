"use server"

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { CreateCategorySchema, CreateCategorySchemaType, DeleteCategorySchema, DeleteCategorySchemaType } from "@/schema/categories"

export async function CreateCategory(form: CreateCategorySchemaType) {
  const parsedBody = CreateCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error(`bad request: ${JSON.stringify(parsedBody.error.format())}`);
  }

  const user = await currentUser()
  if (!user) {
    redirect("/sign-in");
  }

  const { name, icon, type } = parsedBody.data;

  const existingCategory = await prisma.category.findUnique({
    where: {
      name_userId_type: {
        userId: user.id,
        name,
        type,
      },
    },
  });

  if (existingCategory) {
    throw new Error("該分類已存在");
  }

  try {
    return await prisma.category.create({
      data: {
        userId: user.id,
        name,
        icon,
        type,
      },
    });
  } catch (error) {
    console.error("創建分類失敗:", error);
    throw new Error("創建分類失敗，請稍後再試");
  }
}

export async function DeleteCategory(form: DeleteCategorySchemaType) {
  const parsedBody = DeleteCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error(`bad request: ${JSON.stringify(parsedBody.error.format())}`);
  }

  const user = await currentUser()
  if (!user) {
    redirect("/sign-in")
  }

  const existingCategory = await prisma.category.findUnique({
    where: {
      name_userId_type: {
        userId: user.id,
        name: parsedBody.data.name,
        type: parsedBody.data.type,
      },
    },
  });

  if (!existingCategory) {
    throw new Error("分類不存在，無法刪除");
  }

  try {
    const categories = await prisma.category.delete({
      where: {
        name_userId_type: {
          userId: user.id,
          name: parsedBody.data.name,
          type: parsedBody.data.type,
        },
      },
    });
    return categories;
  } catch (error) {
    console.error("創建分類失敗:", error);
    throw new Error("刪除分類失敗，請稍後再試");
  }
}