import { Router } from "express";
import LessonController from "../controllers/lessonController";
import { CourseValidator } from "../validators/courseValidation";
import { ValidationMiddleware } from "../middlewares/validationMiddleware";
import { authGuard } from "../middlewares/authGuard";
import { upload } from "../utils/fileUpload";
import { parseModules } from "../middlewares/parseModules";

class LessonRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // this.router.post(
    //   "/create",
    //   uploadProfilePic.single("content"),
    //   LessonController.createLesson
    // );
  }
}

export default new LessonRoutes().router;
