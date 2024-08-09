import { body, ValidationChain } from "express-validator";

export class ModuleValidator {
  public static validateCreateModule: ValidationChain[] = [
    body("courseRef")
      .isMongoId()
      .withMessage("Course id must be a valid mongoDB id"),
    body("title").notEmpty(),
  ];
}
