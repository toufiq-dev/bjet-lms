import { body, param, ValidationChain } from "express-validator";

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

  public static validateUpdateOneById: ValidationChain[] = [
    param("id").isMongoId().withMessage("Id must be a valid mongoDB id"),
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

  public static validateDeleteOneById: ValidationChain[] = [
    param("id").isMongoId().withMessage("Id must be a valid mongoDB id"),
  ];
}

export default LessonValidator;
