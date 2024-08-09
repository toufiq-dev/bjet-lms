import { body, ValidationChain } from "express-validator";

export class UserProfileValidator {
  public static validateProfileUpdate: ValidationChain[] = [
    body("name")
      .notEmpty()
      .bail()
      .isString()
      .withMessage("Name must consist characters only")
      .bail()
      .isLength({ max: 100 })
      .withMessage("Name must be within 100 characters"),
  ];

  public static validateProfilePicUpdate: ValidationChain[] = [
    body("id").isMongoId().withMessage("Id must be a valid mongo id"),
  ];
}
