import { Request, Response, NextFunction } from "express";
import { logger } from "./logger";

class ErrorHandler extends Error {
  constructor(public status: number, public message: string) {
    super(message);
  }
}

const handleError = (error: unknown): ErrorHandler => {
  if (error instanceof Error) {
    return new ErrorHandler(500, error.message);
  } else {
    return new ErrorHandler(500, "An unexpected error occurred");
  }
};

const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  logger.error(`${status} - ${message}`);
  res.status(status).json({ status, message });
};

const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({ message: "Resource not found" });
};

export { ErrorHandler, handleError, errorMiddleware, notFoundMiddleware };
