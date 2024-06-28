import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { ErrorHandler } from "../utils/errorHandler";
import HTTP_STATUS from "../constants/statusCodes";
import User, { IUser } from "../models/user";

interface DecodedToken {
  sub: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authGuard = (roles: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken;

      if (!token) {
        throw new ErrorHandler(
          HTTP_STATUS.UNAUTHORIZED,
          "Authentication required"
        );
      }

      const decoded = jwt.verify(token, config.jwtSecret) as DecodedToken;
      const user = await User.findById(decoded.sub);

      if (!user) {
        throw new ErrorHandler(HTTP_STATUS.UNAUTHORIZED, "User not found");
      }

      if (roles.length && !roles.includes(user.role)) {
        throw new ErrorHandler(HTTP_STATUS.FORBIDDEN, "Access denied");
      }

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        next(new ErrorHandler(HTTP_STATUS.UNAUTHORIZED, "Invalid token"));
      } else {
        next(error);
      }
    }
  };
};
