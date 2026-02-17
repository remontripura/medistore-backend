import { Review } from "../../../generated/prisma/client";
import { ReviewWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const getAllReview = async ({
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
  medicineId,
}: {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
  medicineId: string | undefined;
}) => {
  const andConditins: ReviewWhereInput[] = [];
  if (medicineId) {
    andConditins.push({
      medicineId,
    });
  }
  const reviews = await prisma.review.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditins,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
        },
      },
    },
  });
  const total = await prisma.review.count({
    where: {
      AND: andConditins,
    },
  });
  return {
    data: reviews,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const createReview = async (
  data: Omit<Review, "id">,
  userId: string,
  medicineId: string,
) => {
  const order = await prisma.order.findFirst({
    where: {
      userId,
      medicineId,
    },
  });
  if (!order) {
    throw new Error("You aren't allow for review this product.");
  }
  const existReview = await prisma.review.findFirst({
    where: {
      userId,
      medicineId,
    },
  });
  if (existReview) {
    throw new Error("You already reviewed this product.");
  }
  const result = await prisma.review.create({
    data: {
      ...data,
      medicineId,
      userId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      ratings: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    message: "Review Successfully",
    data: result,
  };
};

export const reviewServices = {
  createReview,
  getAllReview,
};
