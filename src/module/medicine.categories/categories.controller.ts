import { NextFunction, Request, Response } from "express";

const createCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unathorized",
      });
    }
    const result = await postServices.createPost(req.body, user.id);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};