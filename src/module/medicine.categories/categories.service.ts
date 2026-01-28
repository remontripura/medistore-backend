import { Categories } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCategories = async (
  data: Omit<Categories, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string,
) => {
  const result = await prisma.categories.create({
    data: {
      ...data,
      sellerId: userId,
    },
  });
  return result;
};

const updateCategories = async (
  postId: string,
  data: Partial<Post>,
  authorId: string,
  isAdmin: boolean
) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });
  if (!isAdmin && postData.authorId !== authorId) {
    throw new Error("You are not the owner of the post");
  }
  if (!isAdmin) {
    delete data.isFeatured;
  }

  return await prisma.post.update({
    where: {
      id: postData.id,
    },
    data,
  });
};

export const categoriesServices = {
  createCategories,
  updateCategories
};
