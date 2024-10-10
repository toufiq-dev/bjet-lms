import Module, { IModule } from "../models/module";
import Course from "../models/course";
import { ErrorHandler } from "../utils/errorHandler";
import HTTP_STATUS from "../constants/statusCodes";
import mongoose, { startSession } from "mongoose";
import Lesson from "../models/lesson";
import { deleteManyFromAWS } from "../utils/fileUpload";

class ModuleService {
  public async createModule(
    courseRef: string,
    title: string,
    lockUntil: Date
  ): Promise<IModule> {
    const course = await Course.findById(courseRef);
    if (!course) {
      throw new ErrorHandler(HTTP_STATUS.NOT_FOUND, "Course not found");
    }

    const lastModule = await Module.findOne({ courseRef: courseRef }).sort({
      order: -1,
    });
    const order = !lastModule ? 1 : lastModule.order + 1;

    const module = await Module.create({
      courseRef: courseRef,
      title: title,
      order: order,
      lockUntil: lockUntil,
    });
    delete module.createdAt, module.updatedAt, module.__v;

    return module;
  }

  async getAllByCourseId(
    courseId: mongoose.Types.ObjectId
  ): Promise<IModule[]> {
    const modules = await Module.find({ courseRef: courseId })
      .sort({
        order: 1,
      })
      .select("-createdAt -updatedAt -__v")
      .populate({
        path: "lessonRefs",
        select: "-createdAt -updatedAt -__v",
      });

    return modules;
  }

  async updateOneById(
    id: mongoose.Types.ObjectId,
    title: string,
    lockUntil: Date
  ): Promise<IModule> {
    const module = await Module.findByIdAndUpdate(
      id,
      { title, lockUntil },
      { new: true }
    ).select("-createdAt -updatedAt -__v");
    if (!module) {
      throw new ErrorHandler(HTTP_STATUS.NOT_FOUND, "Module not found");
    }

    return module;
  }

  async deleteOneById(id: mongoose.Types.ObjectId): Promise<IModule> {
    const module = await Module.findById(id);
    if (!module) {
      throw new ErrorHandler(HTTP_STATUS.NOT_FOUND, "Module not found");
    }

    if (module.lessonRefs.length > 0) {
      const lessons = await Lesson.find({ moduleRef: id });

      const urls = lessons.map((lesson) => new URL(lesson.content));

      await deleteManyFromAWS(urls);
    }

    const session = await startSession();
    session.startTransaction();
    let deletedModule;

    try {
      await Lesson.deleteMany({ moduleRef: id }).session(session);

      deletedModule = await Module.findByIdAndDelete(id)
        .select("-createdAt -updatedAt -__v")
        .session(session);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }

    return deletedModule as IModule;
  }
}

export default ModuleService;
