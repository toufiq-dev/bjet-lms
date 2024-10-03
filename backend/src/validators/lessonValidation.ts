import { body, ValidationChain } from "express-validator";

class LessonValidator {
  public static validateCreateLesson: ValidationChain[] = [
    body("moduleId")
      .isMongoId()
      .withMessage("Module id must be a valid mongoDB id"),
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
  ];
}

export default LessonValidator;
