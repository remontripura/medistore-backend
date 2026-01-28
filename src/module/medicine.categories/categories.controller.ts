import { NextFunction, Request, Response } from "express";
import { categoriesServices } from "./categories.service";

const createCategories = async (
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
    const result = await categoriesServices.createCategories(req.body, user.id);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};
const updateCategories = async (
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
    const result = await categoriesServices.createCategories(req.body, user.id);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const categoriesController = {
  createCategories,
  updateCategories
};
