import Module, { IModule } from "../models/module";
import Course from "../models/course";
import { ErrorHandler } from "../utils/errorHandler";
import HTTP_STATUS from "../constants/statusCodes";
import mongoose from "mongoose";

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
}

export default ModuleService;
