// courseService.ts
import { Schema, startSession } from "mongoose";
import Course, { ICourse } from "../models/course";
import Module, { IModule } from "../models/module";
import Lesson, { ILesson } from "../models/lesson";
import { ErrorHandler } from "../utils/errorHandler";
import HTTP_STATUS from "../constants/statusCodes";
import { saveMultipleFiles } from "../utils/fileUpload";
import config from "../config";

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
  ): Promise<any> {
    const session = await startSession();
    session.startTransaction();

    try {
      await this.checkExistingCourse(title);

      const course: any = await this.createCourseDocument(
        title,
        description,
        teacherRef,
        session
      );
      const uploadedFiles = await this.processUploadedFiles(
        pdfFiles,
        videoFiles
      );
      // const createdModules = await this.createModulesAndLessons(
      //   modules,
      //   course._id,
      //   uploadedFiles,
      //   session
      // );

      await session.commitTransaction();
      session.endSession();

      // return this.constructExtendedCourse(course, createdModules);
      return this.constructExtendedCourse(course);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      throw new ErrorHandler(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Course creation failed"
      );
    }
  }

  private async checkExistingCourse(title: string): Promise<void> {
    const existingCourse = await Course.findOne({ title });
    if (existingCourse) {
      throw new ErrorHandler(
        HTTP_STATUS.CONFLICT,
        "A course with this title already exists"
      );
    }
  }

  private async createCourseDocument(
    title: string,
    description: string,
    teacherRef: string,
    session: any
  ): Promise<ICourse> {
    const course = new Course({ title, description, teacherRef });
    await course.save({ session });
    return course;
  }

  private async processUploadedFiles(
    pdfFiles: Express.Multer.File[],
    videoFiles: Express.Multer.File[]
  ): Promise<{ [key: string]: string }> {
    const [pdfUploadedFiles, videoUploadedFiles] = await Promise.all([
      saveMultipleFiles(pdfFiles, config.pdfDir),
      saveMultipleFiles(videoFiles, config.videoDir),
    ]);

    return { ...pdfUploadedFiles, ...videoUploadedFiles };
  }

  private async createModulesAndLessons(
    modules: IModuleInput[],
    courseId: Schema.Types.ObjectId,
    uploadedFiles: { [key: string]: string },
    session: any
  ): Promise<Array<IModule & { lessons: ILesson[] }>> {
    const createdModules: Array<IModule & { lessons: ILesson[] }> = [];

    for (const moduleInput of modules) {
      const newModule: any = new Module({
        title: moduleInput.title,
        description: moduleInput.description,
        order: moduleInput.order,
        courseRef: courseId,
      });

      const createdLessons = await this.createLessons(
        moduleInput.lessons,
        newModule._id,
        uploadedFiles,
        session
      );

      newModule.lessonRefs = createdLessons.map((lesson) => lesson._id);
      await newModule.save({ session });

      createdModules.push({
        ...newModule.toObject(),
        lessons: createdLessons.map((lesson) => lesson.toObject()),
      });
    }

    return createdModules;
  }

  private async createLessons(
    lessons: ILessonInput[],
    moduleId: Schema.Types.ObjectId,
    uploadedFiles: { [key: string]: string },
    session: any
  ): Promise<ILesson[]> {
    const createdLessons: ILesson[] = [];

    for (const lessonInput of lessons) {
      const fileData =
        lessonInput.content.type === "file"
          ? this.getFileData(uploadedFiles, lessonInput.title)
          : lessonInput.content.data;

      const newLesson = new Lesson({
        title: lessonInput.title,
        content: { type: lessonInput.content.type, data: fileData },
        order: lessonInput.order,
        moduleRef: moduleId,
      });

      await newLesson.save({ session });
      createdLessons.push(newLesson);
    }

    return createdLessons;
  }

  private getFileData(
    uploadedFiles: { [key: string]: string },
    lessonTitle: string
  ): string {
    const fileEntry = Object.entries(uploadedFiles)[0];
    if (!fileEntry) {
      throw new Error(`No file uploaded for lesson: ${lessonTitle}`);
    }
    const fileData = fileEntry[1];
    delete uploadedFiles[fileEntry[0]];
    return fileData;
  }

  // private constructExtendedCourse(
  //   course: ICourse,
  //   modules: Array<IModule & { lessons: ILesson[] }>
  // ): any {
  //   return { ...course.toObject(), modules };
  // }

  private constructExtendedCourse(course: ICourse): any {
    return { ...course.toObject() };
  }

  public async getCourseById(id: string): Promise<object> {
    const course = await Course.findById(id).select(
      "-createdAt -updatedAt -__v"
    );
    if (!course) {
      throw new ErrorHandler(HTTP_STATUS.NOT_FOUND, "Course not found");
    }

    return course;
  }

  public async getAllByTeacherReference(id: string): Promise<object> {
    const courses = await Course.find({ teacherRef: id }).select(
      "-createdAt -updatedAt -__v"
    );
    if (!courses) {
      throw new ErrorHandler(HTTP_STATUS.NOT_FOUND, "Course not found");
    }

    return courses;
  }
}

export default CourseService;
