import { Request, Response } from "express";
import UserService from "../services/UserService";
import { handleError } from "../utils/errorHandler";

class UserController {
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const userId = await UserService.register(username, password);
      res.status(201).json({ userId });
    } catch (error) {
      const err = handleError(error);
      res.status(err.status).json({ message: err.message });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const token = await UserService.login(username, password);
      if (!token) throw new Error("Invalid credentials");
      res.json({ token });
    } catch (error) {
      const err = handleError(error);
      res.status(err.status).json({ message: err.message });
    }
  }
}

export default new UserController();
