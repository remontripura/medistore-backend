import { NextFunction, Request, Response } from "express";
import { orderServices } from "./order.service";
import { UserRole } from "../../middleware/auth";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unathorized",
      });
    }
    const result = await orderServices.createOrder(req.body, user.id);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};
const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("UnAthorised");
    }
    const { orderId } = req.params;
    const isSeller = user.role === UserRole.SELLER;
    const result = await orderServices.updateOrder(
      orderId!,
      req.body,
      user.id,
      isSeller,
    );
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const orderController = {
  createOrder,
  updateOrder,
};
