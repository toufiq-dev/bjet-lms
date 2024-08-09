import { Router } from "express";
import UserProfileController from "../controllers/userProfileController";
import { UserProfileValidator } from "../validators/userProfileValidation";
import { ValidationMiddleware } from "../middlewares/validationMiddleware";
import { authGuard } from "../middlewares/authGuard";
import { upload, uploadSingle } from "../middlewares/fileMiddleware";

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

    this.router.post(
      "/upload-picture",
      authGuard(),
      upload.single("picture"),
      uploadSingle("profile"),
      ValidationMiddleware.validate(
        UserProfileValidator.validateProfilePicUpdate
      ),
      UserProfileController.uploadProfilePic
    );
  }
}

export default new UserProfileRoutes().router;
