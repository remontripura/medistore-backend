import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../middleware/auth";
import { reviewServices } from "./review.services";

const getAllReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("UnAthorised");
    }
    const isSeller = user.role === UserRole.SELLER;

    const result = await reviewServices.getAllReview(user.id, isSeller);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unathorized",
      });
    }
    const { medicineId } = req.params;
    const result = await reviewServices.createReview(
      req.body,
      user.id,
      medicineId!,
    );
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const reviewController = {
  createReview,
  getAllReview,
};
