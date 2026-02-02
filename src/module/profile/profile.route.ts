import express from "express";
import { profileController } from "./profile.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();
router.get(
  "/",
  auth(UserRole.CUSTOMER, UserRole.SELLER),
  profileController.userProfile,
);
router.get("/admin", auth(UserRole.ADMIN), profileController.getUser);
router.patch(
  "/",
  auth(UserRole.CUSTOMER, UserRole.SELLER),
  profileController.updateProfile,
);
router.patch(
  "/admin/:userId",
  auth(UserRole.ADMIN),
  profileController.updateUserStatus,
);

export const profileRoute = router;
