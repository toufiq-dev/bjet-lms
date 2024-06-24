import { Request, Response, NextFunction } from "express";
import { logger } from "./logger";
import HTTP_STATUS from "../constants/statusCodes";

export class ErrorHandler extends Error {
  constructor(
    public status: number,
    public message: string,
    public errors?: any
  ) {
    super(message);
  }
}

export const errorMiddleware = (
  err: ErrorHandler | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let errors;

  if (err instanceof ErrorHandler) {
    status = err.status;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof Error) {
    message = err.message;
  }

  logger.error(`${status} - ${message}`);
  if (errors) {
    logger.error(JSON.stringify(errors));
  }

  res.status(status).json({
    status,
    message,
    errors,
  });
};

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Resource not found" });
};
