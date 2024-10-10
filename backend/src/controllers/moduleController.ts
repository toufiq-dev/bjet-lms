import mongoose from "mongoose";
import HTTP_STATUS from "../constants/statusCodes";
import ModuleService from "../services/moduleService";
import { ResponseUtil } from "../utils/responseUtil";
import { Request, Response } from "express";

class ModuleController {
  constructor(private moduleService: ModuleService) {}

  public createModule = async (req: Request, res: Response): Promise<void> => {
    try {
      const { courseRef, title, lockUntil } = req.body;

      const module = await this.moduleService.createModule(
        courseRef,
        title,
        lockUntil
      );

      ResponseUtil.sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Module is created successfully",
        module
      );
    } catch (error) {
      ResponseUtil.sendError(res, error);
    }
  };

  getAllByCourseId = async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;

      const modules = await this.moduleService.getAllByCourseId(
        new mongoose.Types.ObjectId(courseId)
      );

      ResponseUtil.sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Modules retrieved successfully",
        modules
      );
    } catch (error) {
      ResponseUtil.sendError(res, error);
    }
  };

  updateOneById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, lockUntil } = req.body;

      const module = await this.moduleService.updateOneById(
        new mongoose.Types.ObjectId(id),
        title,
        lockUntil
      );

      ResponseUtil.sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Module updated successfully",
        module
      );
    } catch (error) {
      ResponseUtil.sendError(res, error);
    }
  };

  deleteOneById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const module = await this.moduleService.deleteOneById(
        new mongoose.Types.ObjectId(id)
      );

      ResponseUtil.sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Module deleted successfully",
        module
      );
    } catch (error) {
      ResponseUtil.sendError(res, error);
    }
  };
}

export default new ModuleController(new ModuleService());
