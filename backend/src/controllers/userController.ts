import { Request, Response } from "express";
import UserService from "../services/userService";
import { ErrorHandler } from "../utils/errorHandler";
import HTTP_STATUS from "../constants/statusCodes";
import { ResponseUtil } from "../utils/responseUtil";
import config from "../config";

class UserController {
  constructor(private userService: UserService) {}

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, role } = req.body;
      const userId = await this.userService.register(email, password, role);

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

  public signin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken } = await this.userService.signin(
        email,
        password
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: config.accessTokenExpiration,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: config.refreshTokenExpiration,
      });

      ResponseUtil.sendSuccess(res, HTTP_STATUS.OK, "Signin successful");
    } catch (error) {
      ResponseUtil.sendError(res, error);
    }
  };

  public refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new ErrorHandler(
          HTTP_STATUS.UNAUTHORIZED,
          "Refresh token required"
        );
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await this.userService.refreshToken(refreshToken);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: config.accessTokenExpiration,
      });
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        maxAge: config.refreshTokenExpiration,
      });

      ResponseUtil.sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Token refreshed successfully"
      );
    } catch (error) {
      ResponseUtil.sendError(res, error);
    }
  };

  public changePassword = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user!.id;
      await this.userService.changePassword(userId, oldPassword, newPassword);

      ResponseUtil.sendSuccess(
        res,
        HTTP_STATUS.ACCEPTED,
        "Password changed successfully",
        {}
      );
    } catch (error) {
      ResponseUtil.sendError(res, error);
    }
  };
}

export default new UserController(new UserService());
