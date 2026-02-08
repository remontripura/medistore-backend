import express from "express";
import auth, { UserRole } from "../../middleware/auth";
import { medicineController } from "./medicine.controller";
import multer from "multer";

const router = express.Router();

 const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB
  },
});

router.get("/", medicineController.getAllMedicine);
router.get("/:medicineId", medicineController.getMedicineById);
router.patch(
  "/:medicineId",
  auth(UserRole.SELLER),
  medicineController.updateMedicineById,
);
router.post("/", auth(UserRole.SELLER), medicineController.createMedicine);
router.delete(
  "/:medicineId",
  auth(UserRole.SELLER, UserRole.ADMIN),
  medicineController.deleteMedicine,
);

export const medicineRoute = router;
