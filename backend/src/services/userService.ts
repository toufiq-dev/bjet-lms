import User, { IUser } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config";
import { ErrorHandler } from "../utils/errorHandler";
import HTTP_STATUS from "../constants/statusCodes";
import redisClient from "../utils/redis";
import { logger } from "../utils/logger";

class UserService {
  public async register(
    email: string,
    password: string,
    role: string
  ): Promise<string> {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ErrorHandler(HTTP_STATUS.CONFLICT, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role });

    await user.save();

    return user.id;
  }

  public async signin(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ErrorHandler(HTTP_STATUS.UNAUTHORIZED, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ErrorHandler(HTTP_STATUS.UNAUTHORIZED, "Invalid credentials");
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    try {
      if (!redisClient.isReady) {
        throw new Error("Redis client is not ready");
      }
      await redisClient.set(`refresh_token:${user.id}`, refreshToken, {
        EX: config.refreshTokenExpiration,
      });
    } catch (error) {
      logger.error("Failed to set refresh token in Redis", error);
      throw new ErrorHandler(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Failed to complete signin process"
      );
    }

    await user.save();

    return { accessToken, refreshToken };
  }

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

    // Optionally, you might want to invalidate all existing refresh tokens for this user
    await redisClient.del(`refresh_token:${user.id}`);
  }

  private generateAccessToken(user: IUser): string {
    return jwt.sign({ sub: user.id }, config.jwtSecret, { expiresIn: "15m" });
  }

  private generateRefreshToken(user: IUser): string {
    return jwt.sign({ sub: user.id }, config.refreshTokenSecret, {
      expiresIn: config.refreshTokenExpiration,
    });
  }
}

export default UserService;
