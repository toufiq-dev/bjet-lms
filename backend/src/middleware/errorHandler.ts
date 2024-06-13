import { Request, Response, NextFunction } from 'express';

class ErrorHandler extends Error {
  constructor(public status: number, public message: string) {
    super(message);
  }
}

const errorHandler = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ status, message });
};

export { ErrorHandler, errorHandler };
