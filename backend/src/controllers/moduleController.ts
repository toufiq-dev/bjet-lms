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
      console.log(error);
      ResponseUtil.sendError(res, error);
    }
  };
}

export default new ModuleController(new ModuleService());
