import { Router } from "express";
import CourseController from "../controllers/courseController";
import ModuleController from "../controllers/moduleController";
import { ValidationMiddleware } from "../middlewares/validationMiddleware";
import { authGuard } from "../middlewares/authGuard";
import { ModuleValidator } from "../validators/moduleValidation";

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
      ValidationMiddleware.validate(ModuleValidator.validateCreateModule),
      ModuleController.createModule
    );

    this.router.get(
      "/course/:courseId",
      authGuard(["Teacher", "Student"]),
      ValidationMiddleware.validate(ModuleValidator.validateGetAllByCourseId),
      ModuleController.getAllByCourseId
    );

    this.router.patch(
      "/:id",
      authGuard(["Teacher"]),
      ValidationMiddleware.validate(ModuleValidator.validateUpdateOneById),
      ModuleController.updateOneById
    );

    this.router.delete(
      "/:id",
      authGuard(["Teacher"]),
      ValidationMiddleware.validate(ModuleValidator.validateDeleteOneById),
      ModuleController.deleteOneById
    );
  }
}

export default new ModuleRoutes().router;
