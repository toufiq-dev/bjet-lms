import { Request, Response } from "express";
import LessonService from "../services/lessonService";
import HTTP_STATUS from "../constants/statusCodes";
import { ResponseUtil } from "../utils/responseUtil";
import { uploadToS3 } from "../utils/aws";

class LessonController {
  constructor(private lessonService: LessonService) {}

  public createLesson = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title } = req.body;

      // const params = {
      //   Bucket: "bjet-lms",
      //   Key: `${req.file?.mimetype}/${req.file?.originalname}`,
      //   Body: req.file?.buffer,
      // };

      // const content = await uploadToS3(params);

      ResponseUtil.sendSuccess(
        res,
        HTTP_STATUS.OK,
        "File is found",
        req.file?.originalname
      );
    } catch (error) {
      console.log(error);
      ResponseUtil.sendError(res, error);
    }
  };
}

export default new LessonController(new LessonService());
