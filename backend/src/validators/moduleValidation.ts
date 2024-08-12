import { body, ValidationChain } from "express-validator";

export class ModuleValidator {
  public static validateCreateModule: ValidationChain[] = [
    body("courseRef")
      .isMongoId()
      .withMessage("Course id must be a valid mongoDB id"),
    body("title")
      .isString()
      .withMessage("Title must consist characters")
      .bail()
      .trim()
      .notEmpty()
      .withMessage("Title can't be empty")
      .bail()
      .isLength({ max: 200 })
      .withMessage("Title must be within 200 characters"),
    body("lockUntil").isISO8601().withMessage("Invalid lock until date"),
  ];
}
