import { Medicine } from "../../../generated/prisma/client";
import { MedicineWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const getAllMedicine = async ({
  search,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andConditins: MedicineWhereInput[] = [];
  if (search) {
    andConditins.push({
      OR: [
        {
          name: {
            contains: search!,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  const allPost = await prisma.medicine.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditins,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.medicine.count({
    where: {
      AND: andConditins,
    },
  });
  return {
    data: allPost,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
const getMedicineById = async (medicineId: string) => {
  return await prisma.medicine.findUnique({
    where: {
      id: medicineId,
    },
  });
};

const createMedicine = async (
  data: Omit<Medicine, "id" | "createdAt" | "updatedAt">,
  sellerId: string,
) => {
  const result = await prisma.medicine.create({
    data: {
      ...data,
      sellerId: sellerId,
    },
  });
  return result;
};

const updateMedicineById = async (
  medicineId: string,
  data: Partial<Medicine>,
  authorId: string,
) => {
  const medicineData = await prisma.medicine.findUniqueOrThrow({
    where: {
      id: medicineId,
    },
    select: {
      id: true,
      sellerId: true,
    },
  });
  if (medicineData.sellerId !== authorId) {
    throw new Error("You are not the owner of the post");
  }
  return await prisma.medicine.update({
    where: {
      id: medicineData.id,
    },
    data,
  });
};

const deleteMedicine = async (
  sellerId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const medicineData = await prisma.medicine.findUniqueOrThrow({
    where: {
      id: sellerId,
    },
    select: {
      id: true,
      sellerId: true,
    },
  });
  if (!isAdmin && medicineData.sellerId !== authorId) {
    throw new Error("You are not the owner of the post");
  }
  return await prisma.medicine.delete({
    where: {
      id: sellerId,
    },
  });
};

export const medicineServices = {
  createMedicine,
  getAllMedicine,
  getMedicineById,
  updateMedicineById,
  deleteMedicine,
};
