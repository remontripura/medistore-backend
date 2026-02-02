import { NextFunction, Request, Response } from "express";
import { reviewServices } from "./review.services";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const getAllReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
        const medicineId = req.query.medicineId as string | undefined;
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query,
    );
    const result = await reviewServices.getAllReview({
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
      medicineId,
    });
    res.status(200).json(result);
  } catch (err: any) {
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
