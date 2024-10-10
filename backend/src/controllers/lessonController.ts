import { Request, Response } from "express";
import LessonService from "../services/lessonService";
import HTTP_STATUS from "../constants/statusCodes";
import { ResponseUtil } from "../utils/responseUtil";
import { uploadToS3 } from "../utils/aws";
import mongoose from "mongoose";

class LessonController {
  constructor(private lessonService: LessonService) {}

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { moduleId, title } = req.body;
      const lesson = await this.lessonService.create(
        moduleId,
        title,
        req.file as Express.Multer.File
      );

      ResponseUtil.sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Lesson is created successfully",
        lesson
      );
    } catch (error) {
      console.log(error);
      ResponseUtil.sendError(res, error);
    }
  };

  public updateOneById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { title } = req.body;

      const lesson = await this.lessonService.updateOneById(
        new mongoose.Types.ObjectId(id),
        title
      );

      ResponseUtil.sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Lesson is updated successfully",
        lesson
      );
    } catch (error) {
      console.log(error);
      ResponseUtil.sendError(res, error);
    }
  };

  public deleteOneById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const lesson = await this.lessonService.deleteOneById(
        new mongoose.Types.ObjectId(id)
      );

      ResponseUtil.sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Lesson is deleted successfully",
        lesson
      );
    } catch (error) {
      console.log(error);
      ResponseUtil.sendError(res, error);
    }
  };
}

export default new LessonController(new LessonService());
