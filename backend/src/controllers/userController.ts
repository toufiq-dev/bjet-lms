import { Request, Response } from "express";
import UserService from "../services/userService";
import { ErrorHandler } from "../utils/errorHandler";
import HTTP_STATUS from "../constants/statusCodes";
import { ResponseUtil } from "../utils/responseUtil";
import config from "../config";
import { IUser } from "../models/user";

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

  public bulkRegisterStudents = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const emails: string[] = req.body;

      if (!Array.isArray(emails) || emails.length === 0) {
        throw new ErrorHandler(
          HTTP_STATUS.BAD_REQUEST,
          "Invalid input: expected an array of email addresses"
        );
      }

      const result = await this.userService.bulkRegisterStudents(emails);

      res.status(HTTP_STATUS.OK).json({
        message: "Bulk registration completed",
        success: result.success,
        failures: result.failures,
      });
    } catch (error) {
      ResponseUtil.sendError(res, error);
    }
  };

  public signin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken, id, name, role } =
        await this.userService.signin(email, password);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: config.accessTokenExpiration,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: config.refreshTokenExpiration,
      });

      ResponseUtil.sendSuccess(res, HTTP_STATUS.OK, "Signin successful", {
        id,
        name,
        role,
      });
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
      const userId = req.user as IUser;
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

  public signout = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;
      await this.userService.signout(user.id);

      // Clear the cookies
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      ResponseUtil.sendSuccess(res, HTTP_STATUS.OK, "Signout successful", {});
    } catch (error) {
      ResponseUtil.sendError(res, error);
    }
  };

  public forgotPassword = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { email } = req.body;

      await this.userService.forgotPassword(email);

      ResponseUtil.sendSuccess(
        res,
        HTTP_STATUS.ACCEPTED,
        "Forgot password request sent successfully."
      );
    } catch (error) {
      ResponseUtil.sendError(res, error);
    }
  };

  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, newPassword } = req.body;
      console.log(token, newPassword);

      await this.userService.resetPassword(token, newPassword);

      ResponseUtil.sendSuccess(
        res,
        HTTP_STATUS.ACCEPTED,
        "Reset password was successfull."
      );
    } catch (error) {
      ResponseUtil.sendError(res, error);
    }
  };
}

export default new UserController(new UserService());
