import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { Application } from "express";
import config from "./config";
import { auth } from "./lib/auth";
import errorHandler from "./middleware/globalErrorHandler";
import { commentRouter } from "./modules/comment/comment.route";
import { postRouter } from "./modules/post/post.route";

const app: Application = express();
app.use(
  cors({
    origin: config.app_url || "http://localhost:4000",
    credentials: true,
  })
);

app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use(errorHandler);

export default app;
