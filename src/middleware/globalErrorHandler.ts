import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(err);
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = err;
  //   prismaclientvalidation error
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You provide incorrect field type or missing filed";
  }
  //   PrismaClientKnownRequestError
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 400;
      errorMessage =
        "An operation failed because it depends on one or more records that were required but not found. ";
    } else if (err.code === "P2002") {
      statusCode = 400;
      errorMessage = "Duplicate key error";
    } else if (err.code === "P2003") {
      statusCode = 400;
      errorMessage = "Foreign key constraint failed";
    }
  }
  //   PrismaClientKnownRequestError
  else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "Error occurred during error exicution";
  }
  //   PrismaClientInitializationError
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 400;
      errorMessage = "Athentication faild, please check your credintial";
    } else if (err.errorCode === "P1001") {
      statusCode = 400;
      errorMessage = "Can't reach database server";
    }
  }
  res.status(statusCode).json({
    message: errorMessage,
    details: err instanceof Error ? err.message : err,
  });
}
export default errorHandler;
