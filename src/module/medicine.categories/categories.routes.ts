import express from "express";
import { categoriesController } from "./categories.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.post("/", auth(UserRole.SELLER), categoriesController.createCategories);
router.post("/:id", auth(UserRole.SELLER), categoriesController.updateCategories);

export const categoriesRoute = router;
