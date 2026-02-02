import { NextFunction, Request, Response } from "express";
import { profileServices } from "./profile.service";
import { UserRole } from "../../middleware/auth";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (user?.role !== UserRole.ADMIN) {
      throw new Error("UnAthorised");
    }
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query,
    );
    const result = await profileServices.getUser({
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const userProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("UnAthorised");
    }
    const result = await profileServices.userProfile(user.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("UnAthorised");
    }
    const result = await profileServices.updateProfile(req.body, user.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (user?.role !== UserRole.ADMIN) {
      throw new Error("UnAthorised");
    }
    const { userId } = req.params;
    const result = await profileServices.updateUserStatus(req.body, userId!);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const profileController = {
  updateProfile,
  userProfile,
  getUser,
  updateUserStatus,
};
