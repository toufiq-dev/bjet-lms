import { body } from "express-validator";

// Validation rules for user registration
export const validateRegister = [
  body("username").isString().notEmpty().withMessage("Username is required"),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Validation rules for user login
export const validateLogin = [
  body("username").isString().notEmpty().withMessage("Username is required"),
  body("password").isString().notEmpty().withMessage("Password is required"),
];
