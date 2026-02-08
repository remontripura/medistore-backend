import { NextFunction, Request, Response } from "express";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middleware/auth";
import { categoriesServices } from "./categories.service";

const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query,
    );
    const result = await categoriesServices.getAllCategories({
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
    res.status(200).json(result);
  } catch (err: any) {
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
    const user = req.user;
    if (user?.role !== UserRole.ADMIN) {
      return res.status(400).json({
        error: "Unathorized",
      });
    }
    const result = await categoriesServices.getCategoriesBySeller();
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
    if (user?.role !== UserRole.ADMIN) {
      return res.status(400).json({
        error: "Unathorized",
      });
    }
    const result = await categoriesServices.createCategories(req.body);
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
    if (user?.role === UserRole.ADMIN) {
      throw new Error("UnAthorised");
    }
    const { id } = req.params;
    const result = await categoriesServices.updateCategories(id!, req.body);
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
    if (user?.role === UserRole.ADMIN) {
      throw new Error("UnAthorized");
    }
    const { categoryId } = req.params;
    const result = await categoriesServices.deleteCategories(categoryId!);
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
