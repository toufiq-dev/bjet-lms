import Student, { IStudentProfile } from "../models/studentProfile";
import Teacher, { ITeacherProfile } from "../models/teacherProfile";
import Admin, { IAdminProfile } from "../models/adminProfile";
import { ErrorHandler } from "../utils/errorHandler";
import HTTP_STATUS from "../constants/statusCodes";
import { Schema } from "mongoose";
import { uploadToAWS } from "../utils/fileUpload";

type ProfileModel = IStudentProfile | ITeacherProfile | IAdminProfile | null;

class UserProfileService {
  public async updateProfile(
    id: Schema.Types.ObjectId,
    role: "Student" | "Teacher" | "Admin",
    name: string
  ): Promise<{ name: string }> {
    let updatedProfile: ProfileModel;
    switch (role) {
      case "Student":
        updatedProfile = await Student.findByIdAndUpdate(
          { _id: id },
          { name: name },
          { new: true }
        );
        break;
      case "Teacher":
        updatedProfile = await Teacher.findByIdAndUpdate(
          { _id: id },
          { name: name },
          { new: true }
        );
        break;
      case "Admin":
        updatedProfile = await Admin.findByIdAndUpdate(
          { _id: id },
          { name: name },
          { new: true }
        );
        break;
      default:
        throw new ErrorHandler(HTTP_STATUS.BAD_REQUEST, "Invalid role");
    }

    return {
      name: updatedProfile!.name,
    };
  }

  public async uploadProfilePic(
    file: Express.Multer.File | undefined,
    id: Schema.Types.ObjectId,
    role: "Student" | "Teacher" | "Admin"
  ): Promise<string | undefined> {
    let profile: ProfileModel;
    switch (role) {
      case "Student":
        profile = await Student.findById(id);
        break;
      case "Teacher":
        profile = await Teacher.findById(id);
        break;
      case "Admin":
        profile = await Admin.findById(id);
        break;
      default:
        throw new ErrorHandler(HTTP_STATUS.BAD_REQUEST, "Invalid role");
    }

    if (!profile) {
      throw new ErrorHandler(HTTP_STATUS.NOT_FOUND, "Profile not found");
    }

    const url = await uploadToAWS(file);
    profile.image = url;
    await profile.save();

    return profile.image;
  }
}

export default UserProfileService;
