import { Categories } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCategories = async (
  data: Omit<Categories, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
  const result = await prisma.categories.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};