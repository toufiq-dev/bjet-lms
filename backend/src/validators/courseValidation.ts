import { body, param, ValidationChain } from "express-validator";

class LessonValidator {
  public static validateLesson(lesson: any): boolean {
    return (
      typeof lesson.title === "string" &&
      typeof lesson.content === "object" &&
      (lesson.content.type === "text" || lesson.content.type === "file")
    );
  }
}

export class CourseValidator {
  public static validateCreateCourse: ValidationChain[] = [
    body("title")
      .notEmpty()
      .withMessage("Course title is required")
      .isString()
      .withMessage("Course title must be a string")
      .trim(),
    body("description")
      .notEmpty()
      .withMessage("Course description is required")
      .isString()
      .withMessage("Course description must be a string")
      .trim(),
    body("teacherRef")
      .notEmpty()
      .withMessage("Teacher reference is required")
      .isMongoId()
      .withMessage("Invalid teacher reference"),
    body("modules")
      .optional()
      .isArray()
      .withMessage("Modules must be an array"),
    body("modules.*.title")
      .if(body("modules").exists())
      .notEmpty()
      .withMessage("Module title is required")
      .isString()
      .withMessage("Module title must be a string")
      .trim(),
    body("modules.*.description")
      .if(body("modules").exists())
      .notEmpty()
      .withMessage("Module description is required")
      .isString()
      .withMessage("Module description must be a string")
      .trim(),
    body("modules.*.order")
      .if(body("modules").exists())
      .isInt({ min: 0 })
      .withMessage("Module order must be a non-negative integer"),
    body("modules.*.lessons")
      .if(body("modules").exists())
      .custom((lessons: any[]) => lessons.every(LessonValidator.validateLesson))
      .withMessage("Lessons must be an array with valid titles and contents"),
    body("modules.*.lessons.*.order")
      .if(body("modules").exists())
      .isInt({ min: 0 })
      .withMessage("Lesson order must be a non-negative integer"),
    body("modules.*.lessons.*.content.data")
      .if(body("modules.*.lessons.*.content.type").equals("file"))
      .optional()
      .isString()
      .withMessage("Lesson file data must be a string when provided"),
  ];

  public static validateId: ValidationChain[] = [
    param("id").isMongoId().withMessage("Invalid mongoDB id"),
  ];
}
