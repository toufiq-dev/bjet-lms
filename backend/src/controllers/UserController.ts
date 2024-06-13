import { Request, Response } from "express";
import UserService from "../services/UserService";
import { ErrorHandler } from "../middleware/errorHandler";
import handleError from "../utils/errorHandler";

class UserController {
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const userId = await UserService.register(username, password);
      res.status(201).json({ userId });
    } catch (error) {
      handleError(res, error);
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const token = await UserService.login(username, password);
      if (!token) throw new ErrorHandler(401, "Invalid credentials");
      res.json({ token });
    } catch (error) {
      handleError(res, error);
    }
  }
}

export default new UserController();
