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
      const extendedCourse = await this.courseService.createCourse(
        title,
        description,
        teacherRef,
        modules,
        pdfFiles,
        videoFiles
      );

      // Spread the properties of extendedCourse directly into the response data
      ResponseUtil.sendSuccess(
        res,
        HTTP_STATUS.CREATED,
        "Course created successfully",
        { ...extendedCourse }
      );
    } catch (error) {
      ResponseUtil.sendError(res, error);
    }
  };

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const courses = await this.courseService.getAll();

      ResponseUtil.sendSuccess(
        res,
        HTTP_STATUS.OK,
        "All courses received successfully",
        courses
      );
    } catch (error) {
      ResponseUtil.sendError(res, error);
    }
  };

  public getAllByTeacherReference = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const courses = await this.courseService.getAllByTeacherReference(id);

      ResponseUtil.sendSuccess(
        res,
        HTTP_STATUS.OK,
        "All courses received successfully",
        courses
      );
    } catch (error) {
      ResponseUtil.sendError(res, error);
    }
  };

  public getCourseById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const course = await this.courseService.getCourseById(id);

      ResponseUtil.sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Course information received successfully",
        course
      );
    } catch (error) {
      ResponseUtil.sendError(res, error);
    }
  };
}

export default new CourseController(new CourseService());
