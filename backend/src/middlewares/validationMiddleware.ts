import { RequestHandler } from "express";
import {
  validationResult,
  ValidationChain,
  ValidationError,
} from "express-validator";
import { Request, Response, NextFunction } from "express";
import HTTP_STATUS from "../constants/statusCodes";
import { logger } from "../utils/logger";

export class ValidationMiddleware {
  public static validate(validators: ValidationChain[]): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      await Promise.all(validators.map((validator) => validator.run(req)));

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      const extractedErrors = errors.array().map((err: ValidationError) => {
        if ("path" in err) {
          return { [err.path]: err.msg };
        }
        return { error: err.msg };
      });

      logger.error(`Validation failed: ${JSON.stringify(extractedErrors)}`);

      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: HTTP_STATUS.BAD_REQUEST,
        message: "Validation failed",
        errors: extractedErrors,
      });
    };
  }
}
