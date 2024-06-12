import { Request, Response } from 'express';
import UserService from '../services/UserService';

class UserController {
  public async register(req: Request, res: Response): Promise<Response> {
    try {
      const { username, password } = req.body;
      const userId = await UserService.register(username, password);
      return res.status(201).json({ userId });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { username, password } = req.body;
      const token = await UserService.login(username, password);
      if (!token) return res.status(401).json({ message: 'Invalid credentials' });
      return res.json({ token });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new UserController();