import express from "express";
import { categoriesController } from "./categories.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.get("/", categoriesController.getAllCategories);
router.get("/:categoryId", categoriesController.getCategoriesById);
router.get(
  "/seller/:sellerId",
  auth(UserRole.SELLER),
  categoriesController.getCategoriesBySeller,
);
router.post("/", auth(UserRole.SELLER), categoriesController.createCategories);
router.patch(
  "/:id",
  auth(UserRole.SELLER),
  categoriesController.updateCategories,
);
router.delete(
  "/:categoryId",
  auth(UserRole.SELLER),
  categoriesController.deleteCategories,
);

export const categoriesRoute = router;
