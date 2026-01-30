import { Order, OrderStatus } from "../../../generated/prisma/client";
import { generateOrderCode } from "../../helpers/generateRendomOrderCode";
import { prisma } from "../../lib/prisma";

const getMyOrder = async (authorId: string, isSeller: boolean) => {
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

const createOrder = async (
  data: {
    address: string;
    items: { productId: string; quantity: number }[];
  },
  userId: string,
) => {
  const orders = await prisma.$transaction(async (tx) => {
    const createdOrders = [];
    for (const item of data.items) {
      const medicine = await tx.medicine.findUnique({
        where: { id: item.productId },
      });

      if (medicine?.stock! < item.quantity) {
        throw new Error("Product Out Of Stock!");
      }

      await tx.medicine.update({
        where: { id: medicine?.id! },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      const order = await tx.order.create({
        data: {
          userId,
          address: data.address,
          sellerId: medicine?.sellerId ?? null,
          orderCode: generateOrderCode(),
          medicineId: medicine?.id ?? null,
          quantity: item.quantity,
        },
        include: {
          medicine: true,
        },
      });

      createdOrders.push(order);
    }

    return createdOrders;
  });

  return orders.map((order) => ({
    id: order.id,
    orderCode: order.orderCode,
    address: order.address,
    status: order.status,
    order_track: order.order_track,
    quantity: order.quantity,
    medicine: order.medicine && {
      id: order.medicine.id,
      images: order.medicine.images,
      name: order.medicine.name,
      price: order.medicine.price,
      discount: order.medicine.discount,
      createdAt: order.medicine.createdAt,
      updatedAt: order.medicine.updatedAt,
    },
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }));
};

const updateOrder = async (
  orderId: string,
  data: Partial<Order>,
  authorId: string,
  isSeller: boolean,
) => {
  const order = await prisma.order.findUniqueOrThrow({
    where: {
      id: orderId,
    },
    select: {
      id: true,
      status: true,
      order_track: true,
      sellerId: true,
    },
  });

  if (!isSeller && order.sellerId !== authorId) {
    throw new Error("You are not the owner of the post");
  }
  if (order.status === OrderStatus.APPROVED) {
    if (data.status === OrderStatus.PENDING) {
      throw new Error("You can't chenge previous status.");
    }
  }
  if (order.status === OrderStatus.REJECT) {
    if (
      data.status === OrderStatus.PENDING ||
      data.status === OrderStatus.APPROVED
    ) {
      throw new Error("You can't chenge previous status.");
    }
  }
  return await prisma.order.update({
    where: { id: order.id },
    data: { status: data.status! },
    select: {
      id: true,
      orderCode: true,
      address: true,
      status: true,
      quantity: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const orderServices = {
  createOrder,
  updateOrder,
  getMyOrder,
};

// {
//     "id": "9aa103da-2bc0-44b6-b2c8-12da56c2c129",
//     "orderCode": "ORD-515",
//     "address": "Alutila",
//     "status": "APPROVED",
//     "order_track": "ORDERD",
//     "quantity": 2,
//     "createdAt": "2026-01-30T04:13:07.298Z",
//     "updatedAt": "2026-01-30T04:15:42.463Z"
// }
