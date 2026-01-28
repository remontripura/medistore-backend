import { NextFunction, Request, Response } from "express";
import { categoriesServices } from "./categories.service";
import { UserRole } from "../../middleware/auth";

const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await categoriesServices.getAllCategories();
    res.status(200).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
const getCategoriesById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { categoryId } = req.params;
  try {
    const result = await categoriesServices.getCategoriesById(categoryId!);
    res.status(200).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
const getCategoriesBySeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sellerId } = req.params;
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unathorized",
      });
    }
    const result = await categoriesServices.getCategoriesBySeller(sellerId!);
    res.status(200).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

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
      throw new Error("UnAthorised");
    }
    const { id } = req.params;
    const isAdmin = user.role === UserRole.ADMIN;
    const result = await categoriesServices.updateCategories(
      id!,
      req.body,
      user.id,
      isAdmin,
    );
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const deleteCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("UnAthorized");
    }
    const { categoryId } = req.params;
    const isAdmin = user.role === UserRole.ADMIN;
    const result = await categoriesServices.deleteCategories(
      categoryId!,
      user.id,
      isAdmin,
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const categoriesController = {
  createCategories,
  getCategoriesById,
  updateCategories,
  getAllCategories,
  getCategoriesBySeller,
  deleteCategories,
};
