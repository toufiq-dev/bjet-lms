import { Schema } from "mongoose";
import Course from "../models/course";
import Module from "../models/module";
import Lesson from "../models/lesson";
import { ErrorHandler } from "../utils/errorHandler";
import HTTP_STATUS from "../constants/statusCodes";

interface IModuleInput {
  title: string;
  description: string;
  order: number;
  lessons: ILessonInput[];
}

interface ILessonInput {
  title: string;
  content: {
    type: "text" | "file";
    data: string;
  };
  order: number;
}

class CourseService {
  public async createCourse(
    title: string,
    description: string,
    teacherRef: string,
    modules: IModuleInput[],
    pdfFiles: Express.Multer.File[],
    videoFiles: Express.Multer.File[]
  ): Promise<void> {
    try {
      // Create the course
      const course = await Course.create({ title, description, teacherRef });

      // Process and upload the files, if any
      const uploadedFiles = this.processFiles(pdfFiles, videoFiles);

      // Create modules and lessons if provided
      if (modules && modules.length > 0) {
        for (const moduleInput of modules) {
          const { title, description, order, lessons } = moduleInput;

          // Create the module
          const newModule = await Module.create({
            title,
            description,
            order,
            courseRef: course._id,
          });

          // Create lessons for the module
          if (lessons && lessons.length > 0) {
            const createdLessons = await Promise.all(
              lessons.map(async (lessonInput: ILessonInput) => {
                const { title, content, order } = lessonInput;

                let fileData: string;

                if (content.type === "file") {
                  // Find the first uploaded file
                  const fileEntry = Object.entries(uploadedFiles)[0];

                  if (!fileEntry) {
                    throw new Error(`No file uploaded for lesson: ${title}`);
                  }
                  fileData = fileEntry[1]; // This is the file path
                  delete uploadedFiles[fileEntry[0]]; // Remove the used file from the list
                } else {
                  fileData = content.data || "";
                }

                return await Lesson.create({
                  title,
                  content: {
                    type: content.type,
                    data: fileData,
                  },
                  order,
                  moduleRef: newModule._id,
                });
              })
            );

            // Update module with lesson references
            newModule.lessonRefs = createdLessons.map(
              (lesson) => lesson._id as Schema.Types.ObjectId
            );
            await newModule.save();
          }
        }
      }
    } catch (error) {
      console.log(error);
      throw new ErrorHandler(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Course creation failed"
      );
    }
  }

  private processFiles(
    pdfFiles: Express.Multer.File[],
    videoFiles: Express.Multer.File[]
  ): { [key: string]: string } {
    const uploadedFiles: { [key: string]: string } = {};

    const processFile = (file: Express.Multer.File) => {
      const filePath = `uploads/${file.filename}`;
      uploadedFiles[file.originalname] = filePath;
    };

    pdfFiles.forEach(processFile);
    videoFiles.forEach(processFile);

    return uploadedFiles;
  }
}

export default CourseService;
