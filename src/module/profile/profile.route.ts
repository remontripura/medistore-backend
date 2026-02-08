import express from "express";
import { profileController } from "./profile.controller";
import auth, { UserRole } from "../../middleware/auth";
// import multer from "multer";

const router = express.Router();

// export const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 1 * 1024 * 1024, // 1MB
//   },
// });


router.get(
  "/",
  auth(UserRole.CUSTOMER, UserRole.SELLER),
  profileController.userProfile,
);
router.get("/admin", auth(UserRole.ADMIN), profileController.getUser);
// router.patch(
//   "/",
//   auth(UserRole.CUSTOMER, UserRole.SELLER),
//   upload.single("images"),
//   profileController.updateProfile,
// );

router.patch(
  "/admin/:userId",
  auth(UserRole.ADMIN),
  profileController.updateUserStatus,
);

export const profileRoute = router;
