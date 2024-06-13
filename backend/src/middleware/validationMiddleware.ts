import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validate = (validators: RequestHandler[]): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(
      validators.map((validator) => validator(req, res, () => {}))
    );

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
};
