import { Categories } from "../../../generated/prisma/client";
import { CategoriesCreateManyInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";


const getAllCategories = async ({
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andConditins: CategoriesCreateManyInput[] = [];
  const allCategories = await prisma.categories.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditins,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.review.count({
    where: {
      AND: andConditins,
    },
  });
  return {
    data: allCategories,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getCategoriesById = async (categoryId: string) => {
  return await prisma.categories.findUnique({
    where: {
      id: categoryId,
    },
  });
};

const getCategoriesBySeller = async (sellerId: string) => {
  return await prisma.categories.findMany({
    where: {
      sellerId: sellerId,
    },
  });
};
const createCategories = async (
  data: Omit<Categories, "createdAt" | "updatedAt">,
) => {
  const result = await prisma.categories.create({
    data: {
      ...data,
    },
  });
  return result;
};

const updateCategories = async (
  categoriesId: string,
  data: Partial<Categories>,
  authorId: string,
  isAdmin: boolean,
) => {
  const postData = await prisma.categories.findUniqueOrThrow({
    where: {
      id: categoriesId,
    },
    select: {
      id: true,
      sellerId: true,
    },
  });
  if (!isAdmin && postData.sellerId !== authorId) {
    throw new Error("You are not the owner of the post");
  }
  return await prisma.categories.update({
    where: {
      id: postData.id,
    },
    data,
  });
};
const deleteCategories = async (
  categoryId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const categoryItem = await prisma.categories.findUniqueOrThrow({
    where: {
      id: categoryId,
    },
    select: {
      id: true,
      sellerId: true,
    },
  });
  if (!isAdmin && categoryItem.sellerId !== authorId) {
    throw new Error("You are not the owner of the post");
  }
  return await prisma.categories.delete({
    where: {
      id: categoryId,
    },
  });
};
export const categoriesServices = {
  getCategoriesById,
  createCategories,
  updateCategories,
  getAllCategories,
  getCategoriesBySeller,
  deleteCategories,
};
