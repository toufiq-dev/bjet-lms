import Student, { IStudentProfile } from "../models/studentProfile";
import Teacher, { ITeacherProfile } from "../models/teacherProfile";
import Admin, { IAdminProfile } from "../models/adminProfile";
import { ErrorHandler } from "../utils/errorHandler";
import HTTP_STATUS from "../constants/statusCodes";
import { Schema } from "mongoose";

type ProfileModel = IStudentProfile | ITeacherProfile | IAdminProfile | null;

class UserProfileService {
  /**
   * Updated a user profile with given values.
   * @param id - The id of the user profile.
   * @param role - The role of the user, which can be "Student", "Teacher", or "Admin".
   * @param name - The name of the user.
   * @returns An object containing the updated name of the user.
   * @throws {ErrorHandler} If there is an error during the update.
   */
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
}

export default UserProfileService;
