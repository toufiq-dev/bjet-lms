import mongoose, { Schema, startSession } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import generator from "generate-password";
import User, { IUser } from "../models/user";
import Student, { IStudentProfile } from "../models/studentProfile";
import Teacher, { ITeacherProfile } from "../models/teacherProfile";
import Admin, { IAdminProfile } from "../models/adminProfile";
import config from "../config";
import { ErrorHandler } from "../utils/errorHandler";
import HTTP_STATUS from "../constants/statusCodes";
import redisClient from "../utils/redis";
import { rabbitMQClient } from "../utils/messageBroker";

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
   * Bulk registers students and queues welcome emails.
   * @param emails - Array of student email addresses.
   * @returns Object with arrays of successfully registered students and failures.
   */
  public async bulkRegisterStudents(emails: string[]): Promise<{
    success: string[];
    failures: { email: string; reason: string }[];
  }> {
    const session = await startSession();
    session.startTransaction();

    const success: string[] = [];
    const failures: { email: string; reason: string }[] = [];

    try {
      await rabbitMQClient.connect();

      for (const email of emails) {
        try {
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            failures.push({ email, reason: "User already exists" });
            continue;
          }

          const temporaryPassword = this.generatePassword(9);
          const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
          const resetPassToken = uuidv4();
          const resetPassExperies = new Date(Date.now() + 24 * 60 * 60 * 1000);
          const role = "Student";

          const user = new User({
            email,
            password: hashedPassword,
            role,
            resetPassToken,
            resetPassExperies,
          });

          const profile = new Student({ name: email.split("@")[0], email });

          await profile.save({ session });

          (user as IUser & { [key: string]: Schema.Types.ObjectId })[
            `${role.toLowerCase()}Ref`
          ] = profile._id as Schema.Types.ObjectId;

          await user.save({ session });

          // Publish email notification to RabbitMQ
          const message = this.createWelcomeEmailMessage(
            email,
            temporaryPassword,
            resetPassToken
          );
          await rabbitMQClient.publish("emailQueue", message);

          success.push(email);
        } catch (error) {
          console.log(error);
          failures.push({ email, reason: "Registration failed" });
        }
      }

      await session.commitTransaction();

      return { success, failures };
    } catch (error) {
      // console.log(error);
      await session.abortTransaction();
      throw new ErrorHandler(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Bulk registration failed"
      );
    } finally {
      await rabbitMQClient.close();
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
    id: string;
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
      id: profile.id,
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
    user: IUser,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
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

  /**
   * Initiates the forgot password process for a user.
   * @param email - The email of the user requesting a password reset.
   */
  public async forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ErrorHandler(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    const randNum = Math.floor(Math.random() * 90000) + 10000;

    // Store the hashed token in Redis with an expiration time (15 minutes)
    await redisClient.set(`reset_${randNum}`, user.id, {
      EX: config.forgotPassLinkExpiration,
    });

    // Create reset URL
    const resetUrl = `${config.frontendUrl}/reset-password`;

    // Prepare email message
    const message = {
      from: '"BJET LMS" <from@mailtrap.io>',
      to: user.email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Your OTP is ${randNum}
      Please go to this link to reset your password: ${resetUrl}
      This OTP expire in 15 minutes.`,
    };

    try {
      // Send email using RabbitMQ
      await rabbitMQClient.connect();
      await rabbitMQClient.publish("emailQueue", message);
    } catch (error) {
      // If email sending fails, delete the reset token from Redis
      await redisClient.del(`reset_${randNum}`);
      throw new ErrorHandler(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Failed to send reset email"
      );
    } finally {
      await rabbitMQClient.close();
    }
  }

  /**
   * Resets the user's password using the provided token.
   * @param token - The reset token sent to the user's email.
   * @param newPassword - The new password to set.
   */
  public async resetPassword(
    token: string,
    newPassword: string
  ): Promise<void> {
    try {
      console.log(token, newPassword);
      // Get user id from Redis using the hashed token
      const userId = await redisClient.get(`reset_${token}`);

      if (!userId) {
        throw new ErrorHandler(
          HTTP_STATUS.BAD_REQUEST,
          "Invalid or expired reset token"
        );
      }

      const user = await User.findById(new mongoose.Types.ObjectId(userId));
      if (!user) {
        throw new ErrorHandler(HTTP_STATUS.NOT_FOUND, "User not found");
      }

      // Update password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      // Delete the reset token from Redis
      await redisClient.del(`reset_${token}`);

      // Optionally, you can invalidate all existing sessions for this user
      await redisClient.del(`refresh_token:${user.id}`);
    } catch (error) {
      console.log(error);
    }
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
   * Generates a random password
   * @param
   */
  private generatePassword(length: number = 12): string {
    return generator.generate({
      length: length,
      numbers: true,
      symbols: true,
      uppercase: true,
      lowercase: true,
      strict: true,
    });
  }

  /**
   * Creates a welcome email message for a newly registered student.
   * @param email - The email address of the student.
   * @param temporaryPassword - The temporary password for the student.
   * @param resetPassToken - The token for resetting the password.
   * @returns An object containing the email message details.
   * @private
   */
  private createWelcomeEmailMessage(
    email: string,
    temporaryPassword: string,
    resetPassToken: string
  ): {
    from: string;
    to: string;
    subject: string;
    text: string;
  } {
    return {
      from: '"BJET LMS" <from@mailtrap.io>',
      to: email,
      subject: "Welcome to BJET LMS",
      text: `
        Dear Student,

        Your account has been created in our Learning Management System.

        Your temporary password is: ${temporaryPassword}

        Please click on the following link to set a new password:
        http://localhost:5173/reset-password?token=${resetPassToken}

        This link will expire in 24 hours.

        If you have any questions, please contact our support team.

        Best regards,
        BJET LMS Team
      `,
    };
  }
}

export default UserService;
