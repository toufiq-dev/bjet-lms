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
      // authGuard(["Admin"]), // Only admins can register new users
      UserController.register
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
  }
}

export default new UserRoutes().router;
