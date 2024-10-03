import { Request, Response } from "express";
import LessonService from "../services/lessonService";
import HTTP_STATUS from "../constants/statusCodes";
import { ResponseUtil } from "../utils/responseUtil";
import { uploadToS3 } from "../utils/aws";

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
        lesson.content
      );
    } catch (error) {
      console.log(error);
      ResponseUtil.sendError(res, error);
    }
  };
}

export default new LessonController(new LessonService());
