// import { toNodeHandler } from "better-auth/node";
// import cors from "cors";
// import express, { Application } from "express";
// import multer from "multer";
// import config from "./config";
// import { auth } from "./lib/auth";
// import errorHandler from "./middleware/globalErrorHandler";
// import { categoriesRoute } from "./module/medicine.categories/categories.routes";
// import { medicineRoute } from "./module/medicine/medicine.routes";
// import { orderRoute } from "./module/order/order.route";
// import { profileRoute } from "./module/profile/profile.route";
// import { reviewRoute } from "./module/review/review.route";

// const storage = multer.memoryStorage();
// export const upload = multer({ storage });

// const app: Application = express();
// // app.use(
// //   cors({
// //     origin: config.app_url || "http://localhost:3000",
// //     credentials: true,
// //   }),
// // );


// // Configure CORS to allow both production and Vercel preview deployments
// const allowedOrigins = [
//   process.env.APP_URL || "http://localhost:4000",
//   process.env.PROD_APP_URL, // Production frontend URL
//   "http://localhost:3000",
//   "http://localhost:4000",
//   "http://localhost:5000",
// ].filter(Boolean); // Remove undefined values

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow requests with no origin (mobile apps, Postman, etc.)
//       if (!origin) return callback(null, true);

//       // Check if origin is in allowedOrigins or matches Vercel preview pattern
//       const isAllowed =
//         allowedOrigins.includes(origin) ||
//         /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
//         /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

//       if (isAllowed) {
//         callback(null, true);
//       } else {
//         callback(new Error(`Origin ${origin} not allowed by CORS`));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
//     exposedHeaders: ["Set-Cookie"],
//   }),
// );

// app.use(express.json());
// app.all("/api/auth/*splat", toNodeHandler(auth));
// app.use("/categories", categoriesRoute);
// app.use("/medicine", upload.single("images"), medicineRoute);
// app.use("/order", orderRoute);
// app.use("/review", reviewRoute);
// app.use("/user", upload.single("image"), profileRoute);
// app.use(errorHandler);

// export default app;


import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { Application } from "express";
import { auth } from "./lib/auth";
import { categoriesRoute } from "./module/medicine.categories/categories.routes";
import { orderRoute } from "./module/order/order.route";
import { reviewRoute } from "./module/review/review.route";
import { profileRoute } from "./module/profile/profile.route";
import { medicineRoute } from "./module/medicine/medicine.routes";
import errorHandler from "./middleware/globalErrorHandler";
// import multer from "multer";

const app: Application = express();

// const storage = multer.memoryStorage();
// export const upload = multer({ storage });


// Configure CORS to allow both production and Vercel preview deployments
const allowedOrigins = [
  process.env.APP_URL || "http://localhost:4000",
  process.env.PROD_APP_URL, // Production frontend URL
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:5000",
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowedOrigins or matches Vercel preview pattern
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
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

// For Vercel serverless
export default app;