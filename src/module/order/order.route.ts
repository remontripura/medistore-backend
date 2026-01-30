import express from "express";
import auth, { UserRole } from "../../middleware/auth";
import { orderController } from "./order.controller";

const router = express.Router();
router.get(
  "/my-order",
  auth(UserRole.CUSTOMER, UserRole.SELLER),
  orderController.getMyOrder,
);
router.post("/", auth(UserRole.CUSTOMER), orderController.createOrder);
router.patch("/:orderId", auth(UserRole.SELLER), orderController.updateOrder);

export const orderRoute = router;
