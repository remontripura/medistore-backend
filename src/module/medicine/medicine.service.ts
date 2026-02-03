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
  const allMedicine = await prisma.medicine.findMany({
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
      images: true,
      name: true,
      price: true,
      discount: true,
      stock: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      reviews: {
        select: {
          ratings: true,
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },

      createdAt: true,
      updatedAt: true,
    },
  });

  const total = await prisma.medicine.count({
    where: {
      AND: andConditins,
    },
  });
  const allMedicineData = allMedicine.map((medicine) => {
    const total_reviews = medicine.reviews.length;
    const avg_ratings =
      total_reviews === 0
        ? 0
        : medicine.reviews.reduce((sum, r) => sum + r.ratings, 0) /
          total_reviews;

    return {
      id: medicine.id,
      images: medicine.images,
      name: medicine.name,
      price: medicine.price,
      discount: medicine.discount,
      stock: medicine.stock,
      category: medicine.category,
      avg_ratings: Number(avg_ratings.toFixed(1)),
      total_reviews,
      createdAt: medicine.createdAt,
      updatedAt: medicine.updatedAt,
    };
  });
  return {
    data: allMedicineData,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getMedicineById = async (medicineId: string) => {
  const medicineData = await prisma.medicine.findUnique({
    where: { id: medicineId },
    select: {
      id: true,
      images: true,
      name: true,
      price: true,
      discount: true,
      stock: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!medicineData) return null;

  const reviewStats = await prisma.review.aggregate({
    where: { medicineId },
    _count: { id: true },
    _avg: { ratings: true },
  });

  return {
    id: medicineData?.id,
    images: medicineData?.images,
    name: medicineData?.name,
    price: medicineData?.price,
    discount: medicineData?.discount,
    stock: medicineData?.stock,
    avg_review: Number(reviewStats._avg.ratings ?? 0),
    total_review: reviewStats._count.id ?? 0,
    createdAt: medicineData?.createdAt,
    updatedAt: medicineData?.updatedAt,
  };
};

const createMedicine = async (
  data: Omit<Medicine, "id" | "createdAt" | "updatedAt">,
  sellerId: string,
) => {
  const { categoryId, ...rest } = data;
  const result = await prisma.medicine.create({
    data: {
      ...rest,
      category: {
        connect: { id: categoryId },
      },
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
