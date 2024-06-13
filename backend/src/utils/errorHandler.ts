import { Request, Response, NextFunction } from "express";

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
  res.status(status).json({ status, message });
};

export { ErrorHandler, handleError, errorMiddleware };
