import { Schema, startSession } from "mongoose";
import User, { IUser } from "../models/user";
import Student, { IStudentProfile } from "../models/studentProfile";
import Teacher, { ITeacherProfile } from "../models/teacherProfile";
import Admin, { IAdminProfile } from "../models/adminProfile";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config";
import { ErrorHandler } from "../utils/errorHandler";
import HTTP_STATUS from "../constants/statusCodes";
import redisClient from "../utils/redis";

type ProfileModel = IStudentProfile | ITeacherProfile | IAdminProfile;

class UserService {
  /**
   * Registers a new user with the specified role.
   * @param email - The email of the user.
   * @param password - The password of the user.
   * @param role - The role of the user, which can be "Student", "Teacher", or "Admin".
   * @returns The ID of the newly registered user.
   * @throws {ErrorHandler} If the user already exists or if there is an error during registration.
   */
  public async register(
    email: string,
    password: string,
    role: "Student" | "Teacher" | "Admin"
  ): Promise<string> {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ErrorHandler(HTTP_STATUS.CONFLICT, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const name = email.split("@")[0];
    const user = new User({ email, password: hashedPassword, role });

    const session = await startSession();
    session.startTransaction();

    try {
      let profile: ProfileModel;
      switch (role) {
        case "Student":
          profile = new Student({ name, email });
          break;
        case "Teacher":
          profile = new Teacher({ name, email });
          break;
        case "Admin":
          profile = new Admin({ name, email });
          break;
        default:
          throw new ErrorHandler(HTTP_STATUS.BAD_REQUEST, "Invalid role");
      }

      await profile.save({ session });

      (user as IUser & { [key: string]: Schema.Types.ObjectId })[
        `${role.toLowerCase()}Ref`
      ] = profile._id as Schema.Types.ObjectId;

      await user.save({ session });
      await session.commitTransaction();

      return user.id;
    } catch (error) {
      await session.abortTransaction();
      throw new ErrorHandler(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Registration failed"
      );
    } finally {
      session.endSession();
    }
  }

  /**
   * Signs in a user and generates access and refresh tokens.
   * @param email - The email of the user.
   * @param password - The password of the user.
   * @returns An object containing the access token, refresh token, name, and role of the user.
   * @throws {ErrorHandler} If the credentials are invalid or if there is an error during sign-in.
   */
  public async signin(
    email: string,
    password: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    name: string;
    role: string;
  }> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ErrorHandler(HTTP_STATUS.UNAUTHORIZED, "Invalid credentials");
    }

    if (!user.active) {
      throw new ErrorHandler(HTTP_STATUS.FORBIDDEN, "Account is inactive");
    }

    if (user.lockLogin && new Date() < user.lockLogin) {
      throw new ErrorHandler(
        HTTP_STATUS.FORBIDDEN,
        "Account is locked due to multiple invalid login attempts"
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.invalidLoginAttempts = (user.invalidLoginAttempts || 0) + 1;

      if (user.invalidLoginAttempts >= config.maxInvalidLoginAttempts) {
        user.lockLogin = new Date(Date.now() + config.lockDuration);
      }

      await user.save();
      throw new ErrorHandler(HTTP_STATUS.UNAUTHORIZED, "Invalid credentials");
    }

    // Reset invalid login attempts on successful login
    user.invalidLoginAttempts = 0;
    user.lockLogin = null;
    await user.save();

    const accessToken = this.generateAccessToken(user);
    let refreshToken = await redisClient.get(`refresh_token:${user.id}`);

    if (refreshToken) {
      try {
        jwt.verify(refreshToken, config.refreshTokenSecret);
      } catch (error) {
        // Token is invalid or expired, generate a new one
        refreshToken = this.generateRefreshToken(user);
        await redisClient.set(`refresh_token:${user.id}`, refreshToken, {
          EX: config.refreshTokenExpiration,
        });
      }
    }

    if (!refreshToken) {
      refreshToken = this.generateRefreshToken(user);
      await redisClient.set(`refresh_token:${user.id}`, refreshToken, {
        EX: config.refreshTokenExpiration,
      });
    }

    let profile;
    switch (user.role) {
      case "Student":
        profile = await Student.findById(user.studentRef);
        break;
      case "Teacher":
        profile = await Teacher.findById(user.teacherRef);
        break;
      case "Admin":
        profile = await Admin.findById(user.adminRef);
        break;
      default:
        throw new ErrorHandler(HTTP_STATUS.BAD_REQUEST, "Invalid user role");
    }

    if (!profile) {
      throw new ErrorHandler(HTTP_STATUS.NOT_FOUND, "User profile not found");
    }

    return {
      accessToken,
      refreshToken,
      name: profile.name,
      role: user.role,
    };
  }

  /**
   * Refreshes the access and refresh tokens for a user.
   * @param token - The refresh token of the user.
   * @returns An object containing the new access token and refresh token.
   * @throws {ErrorHandler} If the refresh token is invalid or if there is an error during token refresh.
   */
  public async refreshToken(
    token: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(token, config.refreshTokenSecret) as {
        sub: string;
      };

      // Check if the refresh token exists in Redis
      const storedToken = await redisClient.get(`refresh_token:${decoded.sub}`);

      if (!storedToken || storedToken !== token) {
        throw new ErrorHandler(
          HTTP_STATUS.UNAUTHORIZED,
          "Invalid refresh token"
        );
      }

      const user = await User.findById(decoded.sub);

      if (!user) {
        throw new ErrorHandler(HTTP_STATUS.UNAUTHORIZED, "User not found");
      }

      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Update the refresh token in Redis
      await redisClient.set(`refresh_token:${user.id}`, refreshToken, {
        EX: config.refreshTokenExpiration,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new ErrorHandler(HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token");
    }
  }

  /**
   * Changes the password for a user.
   * @param userId - The ID of the user.
   * @param oldPassword - The current password of the user.
   * @param newPassword - The new password for the user.
   * @throws {ErrorHandler} If the user is not found, the old password is incorrect, or if there is an error during password change.
   */
  public async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ErrorHandler(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new ErrorHandler(HTTP_STATUS.UNAUTHORIZED, "Invalid old password");
    }

    if (oldPassword === newPassword) {
      throw new ErrorHandler(
        HTTP_STATUS.BAD_REQUEST,
        "New password must be different from the old password"
      );
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    await redisClient.del(`refresh_token:${user.id}`);
  }

  /**
   * Generates an access token for a user.
   * @param user - The user for whom the access token is generated.
   * @returns The generated access token.
   */
  private generateAccessToken(user: IUser): string {
    return jwt.sign({ sub: user.id }, config.jwtSecret, { expiresIn: "15m" });
  }

  /**
   * Generates a refresh token for a user.
   * @param user - The user for whom the refresh token is generated.
   * @returns The generated refresh token.
   */
  private generateRefreshToken(user: IUser): string {
    return jwt.sign({ sub: user.id }, config.refreshTokenSecret, {
      expiresIn: config.refreshTokenExpiration,
    });
  }

  /**
   * Signs out a user and revoke refreshToken
   * @param userId
   */
  public async signout(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ErrorHandler(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    await redisClient.del(`refresh_token:${userId}`);
  }
}

export default UserService;
