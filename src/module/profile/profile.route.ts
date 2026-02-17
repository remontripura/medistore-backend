import express from "express";
import auth, { UserRole } from "../../middleware/auth";
import { profileController } from "./profile.controller";

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
