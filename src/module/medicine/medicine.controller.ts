import { NextFunction, Request, Response } from "express";
import { medicineServices } from "./medicine.service";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middleware/auth";

const getAllMedicine = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query,
    );
    const result = await medicineServices.getAllMedicine({
      search: searchString,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getMedicineById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { medicineId } = req.params;
  try {
    const result = await medicineServices.getMedicineById(medicineId!);
    res.status(200).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const createMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("first");
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unathorized",
      });
    }

    const result = await medicineServices.createMedicine(req.body, user.id);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const updateMedicineById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("UnAthorised");
    }
    const { medicineId } = req.params;
    const result = await medicineServices.updateMedicineById(
      medicineId!,
      req.body,
      user.id,
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const deleteMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("UnAthorized");
    }
    const { medicineId } = req.params;
    const isAdmin = user.role === UserRole.ADMIN;
    const result = await medicineServices.deleteMedicine(
      medicineId!,
      user.id,
      isAdmin,
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const medicineController = {
  createMedicine,
  getAllMedicine,
  getMedicineById,
  updateMedicineById,
  deleteMedicine,
};
