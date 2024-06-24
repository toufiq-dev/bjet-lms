import { Response } from "express";
import { ErrorHandler } from "./errorHandler";
import HTTP_STATUS from "../constants/statusCodes";

export class ResponseUtil {
  public static sendSuccess(
    res: Response,
    status: number,
    message: string,
    data?: any
  ): void {
    res.status(status).json({
      success: true,
      message,
      data,
    });
  }

  public static sendError(res: Response, error: unknown): void {
    if (error instanceof ErrorHandler) {
      res.status(error.status).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    } else {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
}
