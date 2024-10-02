import { Router } from "express";
import UserController from "../controllers/userController";
import { UserValidator } from "../validators/userValidation";
import { ValidationMiddleware } from "../middlewares/validationMiddleware";
import { authGuard } from "../middlewares/authGuard";

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
      authGuard(["Admin"]),
      UserController.register
    );
    this.router.post(
      "/register-students",
      ValidationMiddleware.validate(UserValidator.validateBulkRegister),
      authGuard(["Admin"]),
      UserController.bulkRegisterStudents
    );
    this.router.post(
      "/signin",
      ValidationMiddleware.validate(UserValidator.validateLogin),
      UserController.signin
    );
    this.router.post("/refresh-token", UserController.refreshToken);
    this.router.post(
      "/change-password",
      authGuard(),
      ValidationMiddleware.validate(UserValidator.validateChangePassword),
      UserController.changePassword
    );
    this.router.post("/signout", authGuard(), UserController.signout);
    this.router.patch(
      "/forgot-password",
      ValidationMiddleware.validate(UserValidator.validateForgotPassword),
      UserController.forgotPassword
    );
    this.router.patch("/reset-password", UserController.resetPassword);
  }
}

export default new UserRoutes().router;
