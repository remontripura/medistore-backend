import { Role, User } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
type updateData = {
  name?: string;
  image?: string;
  phone?: string;
};
type updatePass = {
  old_password?: string;
  new_password?: string;
};

const getUser = async ({
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
  const andConditins = [
    {
      role: {
        not: Role.ADMIN,
      },
    },
  ];
  const allCategories = await prisma.user.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditins,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  const total = await prisma.user.count({
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

const userProfile = async (authorId: string) => {
  const res = await prisma.user.findUnique({
    where: {
      id: authorId,
    },
  });
  if (res?.status === "DEACTIVE") {
    throw new Error("Something Went Wrong");
  }
  return {
    id: res?.id,
    name: res?.name,
    email: res?.email,
    image: res?.image,
    phone: res?.phone,
    createdAt: res?.createdAt,
    updatedAt: res?.updatedAt,
  };
};

const updateUserStatus = async (
  payload: {
    status: "ACTIVE" | "DEACTIVE";
  },
  userId: string,
) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      status: payload.status,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return updatedUser;
};

const updateProfile = async (data: updateData, authorId: string) => {
  const updateData: updateData = {};
  if (data.name) updateData.name = data.name;
  if (data.image) updateData.image = data.image;
  if (data.phone) updateData.phone = data.phone;
  const updatedUser = await prisma.user.update({
    where: { id: authorId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return updatedUser;
};

export const profileServices = {
  updateProfile,
  userProfile,
  getUser,
  updateUserStatus,
};
