import { Router } from "express";
import CourseController from "../controllers/courseController";
import { CourseValidator } from "../validators/courseValidation";
import { ValidationMiddleware } from "../middlewares/validationMiddleware";
import { authGuard } from "../middlewares/authGuard";

class ModuleRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/create",
      authGuard(["Teacher"]),
      ValidationMiddleware.validate(CourseValidator.validateCreateCourse),
      CourseController.createCourse
    );
  }
}

export default new ModuleRoutes().router;
