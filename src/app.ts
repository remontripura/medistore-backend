import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { Application } from "express";
import config from "./config";
import { auth } from "./lib/auth";
import errorHandler from "./middleware/globalErrorHandler";
import { categoriesRoute } from "./module/medicine.categories/categories.routes";
import { medicineRoute } from "./module/medicine/medicine.routes";
import { orderRoute } from "./module/order/order.route";
import { profileRoute } from "./module/profile/profile.route";
import { reviewRoute } from "./module/review/review.route";

const app: Application = express();
app.use(
  cors({
    origin: config.app_url || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/categories", categoriesRoute);
app.use("/medicine", medicineRoute);
app.use("/order", orderRoute);
app.use("/review", reviewRoute);
app.use("/user", profileRoute);
app.use(errorHandler);

export default app;
