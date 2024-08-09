import { Request, Response } from "express";
import UserProfileService from "../services/userProfileService";
import HTTP_STATUS from "../constants/statusCodes";
import { ResponseUtil } from "../utils/responseUtil";
import { IUser } from "../models/user";
import { Schema } from "mongoose";
import multer, { MulterError } from "multer";

class UserProfileController {
  constructor(private userProfileService: UserProfileService) {}

  public updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.body;
      const role = req.user!.role;
      const id = (req.user as IUser & { [key: string]: Schema.Types.ObjectId })[
        `${role.toLowerCase()}Ref`
      ];

      const userProfile = await this.userProfileService.updateProfile(
        id,
        role,
        name
      );

      ResponseUtil.sendSuccess(
        res,
        HTTP_STATUS.OK,
        "User profile updated successfully",
        { userProfile }
      );
    } catch (error) {
      ResponseUtil.sendError(res, error);
    }
  };

  public uploadProfilePic = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.body;
      const role = req.user!.role;
      const url = await this.userProfileService.uploadProfilePic(
        req.file,
        id,
        role
      );

      ResponseUtil.sendSuccess(
        res,
        HTTP_STATUS.OK,
        "File successfully uploaded to AWS",
        url
      );
    } catch (error) {
      console.log(error);
      ResponseUtil.sendError(res, error);
    }
  };
}

export default new UserProfileController(new UserProfileService());
