import { Request, Response } from "express";
import UserService from "../services/userService";
import { ErrorHandler } from "../utils/errorHandler";
import HTTP_STATUS from "../constants/statusCodes";
import { ResponseUtil } from "../utils/responseUtil";

class UserController {
  constructor(private userService: UserService) {}

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;
      const userId = await this.userService.register(username, password);
      ResponseUtil.sendSuccess(
        res,
        HTTP_STATUS.CREATED,
        "User registered successfully",
        { userId }
      );
    } catch (error) {
      ResponseUtil.sendError(res, error);
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;
      const token = await this.userService.login(username, password);
      if (!token)
        throw new ErrorHandler(HTTP_STATUS.UNAUTHORIZED, "Invalid credentials");
      ResponseUtil.sendSuccess(res, HTTP_STATUS.OK, "Login successful", {
        token,
      });
    } catch (error) {
      ResponseUtil.sendError(res, error);
    }
  };
}

export default new UserController(new UserService());
