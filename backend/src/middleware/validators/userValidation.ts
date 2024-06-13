import { body } from "express-validator";

export const validateRegister = () => {
  return [
    body("username").isString().notEmpty().withMessage("Username is required"),
    body("password")
      .isString()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ];
};

export const validateLogin = () => {
  return [
    body("username").isString().notEmpty().withMessage("Username is required"),
    body("password").isString().notEmpty().withMessage("Password is required"),
  ];
};
