import { Router } from "express";
import CourseController from "../controllers/courseController";
import { CourseValidator } from "../validators/courseValidation";
import { ValidationMiddleware } from "../middlewares/validationMiddleware";
import { authGuard } from "../middlewares/authGuard";
import { upload } from "../utils/fileUpload";
import { parseModules } from "../middlewares/parseModules";

class CourseRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/create",
      upload.fields([
        { name: "pdf", maxCount: 12 },
        { name: "video", maxCount: 12 },
      ]),
      parseModules,
      ValidationMiddleware.validate(CourseValidator.validateCreateCourse),
      authGuard(["Teacher"]),
      CourseController.createCourse
    );

    this.router.get(
      "/view-course-by-reference/:id",
      authGuard(["Teacher", "Student"]),
      ValidationMiddleware.validate(CourseValidator.validateGetCourseById),
      CourseController.getCourseById
    );

    this.router.get(
      "/get-all-by-teacher-reference/:id",
      authGuard(["Teacher"]),
      ValidationMiddleware.validate(
        CourseValidator.validateGetAllByTeacherReference
      ),
      CourseController.getAllByTeacherReference
    );
  }
}

export default new CourseRoutes().router;
