import User, { IUser } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config";
import { ErrorHandler } from "../utils/errorHandler";
import HTTP_STATUS from "../constants/statusCodes";

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

  public async signin(email: string, password: string): Promise<string> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ErrorHandler(HTTP_STATUS.UNAUTHORIZED, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ErrorHandler(HTTP_STATUS.UNAUTHORIZED, "Invalid credentials");
    }

    return this.generateToken(user);
  }

  private generateToken(user: IUser): string {
    return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
      expiresIn: "1h",
    });
  }
}

export default UserService;
