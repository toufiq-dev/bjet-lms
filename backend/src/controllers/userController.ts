import { Request, Response } from "express";
import UserService from "../services/userService";
import { handleError } from "../utils/errorHandler";
import HTTP_STATUS from "../constants/statusCodes";
import sendResponse from "../utils/commonResponse";

class UserController {
	public async register(req: Request, res: Response): Promise<void> {
		try {
			const { username, password } = req.body;
			const userId = await UserService.register(username, password);
			return sendResponse(
				res,
				HTTP_STATUS.CREATED,
				"Successfully registered the user",
				userId
			);
		} catch (error) {
			const err = handleError(error);
			return sendResponse(
				res,
				err.status,
				err.message,
				"Internal erver error"
			);
		}
	}

	public async login(req: Request, res: Response): Promise<void> {
		try {
			const { username, password } = req.body;
			const token = await UserService.login(username, password);
			if (!token) throw new Error("Invalid credentials");
			return sendResponse(
				res,
				HTTP_STATUS.OK,
				"Successfully signed in",
				token
			);
		} catch (error) {
			const err = handleError(error);
			return sendResponse(
				res,
				err.status,
				err.message,
				"Internal erver error"
			);
		}
	}
}

export default new UserController();
