import { Router } from "express";
import UserController from "../controllers/userController";
import { UserValidator } from "../validators/userValidation";
import { ValidationMiddleware } from "../middleware/validationMiddleware";

class UserRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/register",
      ValidationMiddleware.validate(UserValidator.validateRegister),
      UserController.register
    );
    this.router.post(
      "/signin",
      ValidationMiddleware.validate(UserValidator.validateLogin),
      UserController.signin
    );
    this.router.post(
      "/change-password",
      ValidationMiddleware.validate(UserValidator.validateLogin),
      UserController.signin
    );
  }
}

export default new UserRoutes().router;
