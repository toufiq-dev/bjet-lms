import { Router } from "express";
import UserProfileController from "../controllers/userProfileController";
import { UserProfileValidator } from "../validators/userProfileValidation";
import { ValidationMiddleware } from "../middlewares/validationMiddleware";
import { authGuard } from "../middlewares/authGuard";

class UserProfileRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.patch(
      "/update-profile",
      authGuard(),
      ValidationMiddleware.validate(UserProfileValidator.validateProfileUpdate),
      UserProfileController.updateProfile
    );
  }
}

export default new UserProfileRoutes().router;
