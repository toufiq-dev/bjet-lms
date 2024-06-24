import User, { IUser } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config";
import { ErrorHandler } from "../utils/errorHandler";
import HTTP_STATUS from "../constants/statusCodes";

class UserService {
	public async register(username: string, password: string): Promise<string> {
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			throw new ErrorHandler(
				HTTP_STATUS.CONFLICT,
				"Username already exists"
			);
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({ username, password: hashedPassword });
		await user.save();
		return user.id;
	}

	public async login(username: string, password: string): Promise<string> {
		const user = await User.findOne({ username });
		if (!user) {
			throw new ErrorHandler(
				HTTP_STATUS.UNAUTHORIZED,
				"Invalid credentials"
			);
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			throw new ErrorHandler(
				HTTP_STATUS.UNAUTHORIZED,
				"Invalid credentials"
			);
		}

		return this.generateToken(user);
	}

	private generateToken(user: IUser): string {
		return jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: "1h" });
	}
}

export default UserService;
