import { Order, OrderStatus } from "../../../generated/prisma/client";
import { generateOrderCode } from "../../helpers/generateRendomOrderCode";
import { prisma } from "../../lib/prisma";

const createOrder = async (
  data: {
    address: string;
    items: { productId: string; quantity: number }[];
  },
  userId: string,
) => {
  const order = await prisma.order.create({
    data: {
      userId,
      address: data.address,
      orderCode: generateOrderCode(),
      items: {
        create: data.items,
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
  return {
    orderId: order.id,
    orderCode: order.orderCode,
    address: order.address,
    status: order.status,
    orderTrack: order.order_track,
    items: order.items.map((item) => ({
      productId: item.productId,
      productName: item.product?.name,
      quantity: item.quantity,
      price: item.product?.price,
    })),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
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
      items: true,
      status: true,
      order_track: true,
    },
  });
  const medicine = await prisma.medicine.findUniqueOrThrow({
    where: {
      id: order.items[0]?.productId!,
    },
  });
  if (!isSeller && medicine.sellerId !== authorId) {
    throw new Error("You are not the owner of the post");
  }
  if (
    order.status === OrderStatus.APPROVED ||
    order.status === OrderStatus.REJECT
  ) {
    throw new Error(`Cannot change status once it is ${order.status}`);
  }

  return prisma.order.update({
    where: { id: order.id },
    data: { status: data.status! },
  });
};

export const orderServices = {
  createOrder,
  updateOrder,
};

// {
//      "id": "141f6a53-e592-4c99-a7df-6ce4eb8efc43",
//       "userId": "djv63EsjhciAsGAFRkKnyrsJIanI7gUw",
//        "address": "Alutila",
//         "status": "PENDING",
//         items : [
//             {
//                    "productId": "15f30a35-5540-4e8c-aa14-2ee9df48ec50",
//     "quantity": 2,
//             }
//         ]
//     "order_track": "ORDERD",
//     "createdAt": "2026-01-29T13:58:37.887Z",
//     "updatedAt": "2026-01-29T13:58:37.887Z"
// }
