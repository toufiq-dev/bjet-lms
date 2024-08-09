import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { ErrorHandler } from "../utils/errorHandler";
import HTTP_STATUS from "../constants/statusCodes";
import {
  profilePictureFileTypes,
  courseContentFileTypes,
} from "../constants/fileTypes";
import path from "path";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadSingle = (purpose: string = "course") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new ErrorHandler(HTTP_STATUS.BAD_REQUEST, "No file found");
      }

      const extension = path.extname(req.file.originalname);
      const allowedExtensions =
        purpose === "profile"
          ? profilePictureFileTypes
          : courseContentFileTypes;
      if (!allowedExtensions.includes(extension)) {
        throw new ErrorHandler(
          HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE,
          "File type not supported"
        );
      }

      const fileSize = req.file.size;
      const allowedFileSize =
        purpose === "profile" ? 2 * 1024 * 1024 : 1024 * 1024 * 1024;
      if (fileSize > allowedFileSize) {
        throw new ErrorHandler(
          HTTP_STATUS.CONTENT_TOO_LARGE,
          purpose === "profile"
            ? "File must be less than 2 MB"
            : "File must be less than 1 GB"
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export { upload, uploadSingle };
