import { Router } from "express";
import LessonController from "../controllers/lessonController";
import { ValidationMiddleware } from "../middlewares/validationMiddleware";
import { authGuard } from "../middlewares/authGuard";
import { upload } from "../utils/fileUpload";
import { uploadSingle } from "../middlewares/fileMiddleware";
import LessonValidator from "../validators/lessonValidation";

class LessonRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/",
      authGuard(["Teacher"]),
      upload.single("content"),
      uploadSingle(),
      ValidationMiddleware.validate(LessonValidator.validateCreateLesson),
      LessonController.create
    );

    this.router.patch(
      "/:id",
      authGuard(["Teacher"]),
      ValidationMiddleware.validate(LessonValidator.validateUpdateOneById),
      LessonController.updateOneById
    );

    this.router.delete(
      "/:id",
      ValidationMiddleware.validate(LessonValidator.validateDeleteOneById),
      LessonController.deleteOneById
    );
  }
}

export default new LessonRoutes().router;
