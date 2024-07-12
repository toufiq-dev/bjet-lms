import { Request, Response } from "express";
import CourseService from "../services/courseService";
import HTTP_STATUS from "../constants/statusCodes";
import { ResponseUtil } from "../utils/responseUtil";

class CourseController {
  constructor(private courseService: CourseService) {}

  public createCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, teacherRef, modules } = req.body;

      // Validate file uploads
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const pdfFiles = files["pdf"] || [];
      const videoFiles = files["video"] || [];

      // Call the service to create a course
      const course = await this.courseService.createCourse(
        title,
        description,
        teacherRef,
        modules,
        pdfFiles,
        videoFiles
      );

      ResponseUtil.sendSuccess(
        res,
        HTTP_STATUS.CREATED,
        "Course created successfully",
        { course }
      );
    } catch (error) {
      ResponseUtil.sendError(res, error);
    }
  };
}

export default new CourseController(new CourseService());
