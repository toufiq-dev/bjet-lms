import { body, ValidationChain } from "express-validator";

export const emailValidator = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const passwordValidator = (password: string) => {
  const passwordRegex = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/;
  return passwordRegex.test(password);
};

export class UserValidator {
  public static validateRegister: ValidationChain[] = [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .custom(emailValidator)
      .withMessage("Invalid email format"),
    body("password")
      .isString()
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be at least 8 characters long")
      .custom(passwordValidator)
      .withMessage(
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
      ),
    body("role")
      .isIn(["Student", "Teacher", "Admin"])
      .withMessage("Invalid role. Must be Student, Teacher, or Admin"),
  ];

  public static validateBulkRegister: ValidationChain[] = [
    body()
      .isArray({ min: 1 })
      .withMessage("Request body must be an array of emails"),
    body("*.email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format")
      .custom(emailValidator)
      .withMessage("Invalid email format"),
  ];

  public static validateLogin: ValidationChain[] = [
    body("email")
      .isEmail()
      .custom(emailValidator)
      .withMessage("Invalid email format"),
    body("password").isString().notEmpty().withMessage("Password is required"),
  ];
  public static validateChangePassword: ValidationChain[] = [
    body("oldPassword")
      .isString()
      .notEmpty()
      .withMessage("Old Password is required"),
    body("newPassword")
      .isString()
      .notEmpty()
      .isLength({ min: 8, max: 20 })
      .withMessage("New Password is required"),
  ];
  public static validateForgotPassword: ValidationChain[] = [
    body("email").isEmail().withMessage("Invalid email format"),
  ];
}
