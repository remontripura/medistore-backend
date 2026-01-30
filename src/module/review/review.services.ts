import { Review } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getAllReview = async (authorId: string, isSeller: boolean) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: authorId,
      status: "ACTIVE",
    },
    select: {
      id: true,
      status: true,
    },
  });
  const whereCondition = isSeller
    ? { sellerId: authorId }
    : { userId: authorId };
  const result = await prisma.order.findMany({
    where: whereCondition,
    orderBy: {
      createdAt: "desc",
    },
  });
  // const total = await prisma.post.aggregate({
  //   _count: {
  //     id: true,
  //   },
  //   where: {
  //     authorId,
  //   },
  // });
  return {
    message: "Order Retrive Successfully",
    data: result,
  };
};

const createReview = async (
  data: Omit<Review, "id">,
  userId: string,
  medicineId: string,
) => {
  const checkOrder = await prisma.order.findMany({
    where: {
      userId: userId,
    },
  });

  const findOrderData = checkOrder.find(
    (item) => item.medicineId === medicineId,
  );
  if (findOrderData?.medicineId !== medicineId) {
    throw new Error("You aren't allow for review this product.");
  }
  const result = await prisma.review.create({
    data: {
      ...data,
      medicineId: medicineId,
      userId: userId,
    },
    select: {
      id: true,
      title: true,
      descirption: true,
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
