import { body, ValidationChain } from "express-validator";

export class UserValidator {
  public static validateRegister: ValidationChain[] = [
    body("username").isString().notEmpty().withMessage("Username is required"),
    body("password")
      .isString()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ];

  public static validateLogin: ValidationChain[] = [
    body("username").isString().notEmpty().withMessage("Username is required"),
    body("password").isString().notEmpty().withMessage("Password is required"),
  ];
}
