import mongoose, { startSession } from "mongoose";
import Lesson, { ILesson } from "../models/lesson";
import Module from "../models/module";
import { ErrorHandler } from "../utils/errorHandler";
import HTTP_STATUS from "../constants/statusCodes";
import { deleteOneFromAWS, uploadToAWS } from "../utils/fileUpload";

class LessonService {
  async create(
    moduleId: mongoose.Types.ObjectId,
    title: string,
    file: Express.Multer.File
  ): Promise<ILesson> {
    const module = await Module.findById(moduleId);
    if (!module) {
      throw new ErrorHandler(HTTP_STATUS.NOT_FOUND, "Module not found");
    }

    const lastLesson = await Lesson.findOne({ moduleRef: moduleId }).sort({
      order: -1,
    });
    const order = !lastLesson ? 1 : lastLesson.order + 1;

    const url = await uploadToAWS(file);

    let lesson;
    const session = await startSession();
    session.startTransaction();

    try {
      lesson = new Lesson({
        title,
        content: url,
        order,
        moduleRef: moduleId,
      });

      await lesson.save({ session });

      await Module.findByIdAndUpdate(
        moduleId,
        { $push: { lessonRefs: lesson._id } },
        { new: true, session }
      );

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new ErrorHandler(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Lesson creation failed"
      );
    } finally {
      session.endSession();
    }

    const { createdAt, updatedAt, __v, ...formattedLesson } = lesson.toObject();

    return formattedLesson as ILesson;
  }

  async updateOneById(
    id: mongoose.Types.ObjectId,
    title: string
  ): Promise<ILesson> {
    const lesson = await Lesson.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    ).select("-createdAt -updatedAt -__v");
    if (!lesson) {
      throw new ErrorHandler(HTTP_STATUS.NOT_FOUND, "Lesson not found");
    }

    return lesson;
  }

  async deleteOneById(id: mongoose.Types.ObjectId): Promise<ILesson> {
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      throw new ErrorHandler(HTTP_STATUS.NOT_FOUND, "Lesson not found");
    }

    await deleteOneFromAWS(new URL(lesson.content));

    const session = await startSession();
    session.startTransaction();
    let deletedLesson;

    try {
      await Module.findByIdAndUpdate(
        lesson.moduleRef,
        { $pull: { lessonRefs: lesson._id } },
        { new: true, session }
      );

      deletedLesson = await Lesson.findByIdAndDelete(id)
        .select("-createdAt -updatedAt -__v")
        .session(session);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }

    return deletedLesson as ILesson;
  }
}

export default LessonService;
