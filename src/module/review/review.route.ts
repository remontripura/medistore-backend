import express from "express";
import auth, { UserRole } from "../../middleware/auth";
import { reviewController } from "./review.controller";

const router = express.Router();
router.get("/:medicineId", reviewController.getAllReview);
router.post("/:medicineId", auth(UserRole.CUSTOMER), reviewController.createReview);

export const reviewRoute = router;
