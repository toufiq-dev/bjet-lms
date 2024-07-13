import { body, ValidationChain } from "express-validator";

export class UserProfileValidator {
  public static validateProfileUpdate: ValidationChain[] = [
    body("name")
      .exists()
      .withMessage("Name must exist")
      .bail()
      .isString()
      .withMessage("Name must consist characters only")
      .bail()
      .trim()
      .notEmpty()
      .withMessage("Name can't be empty")
      .bail()
      .isLength({ max: 100 })
      .withMessage("Name must be within 100 characters"),
  ];
}
