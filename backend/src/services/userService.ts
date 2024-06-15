import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config";

class UserService {
	public async register(username: string, password: string): Promise<string> {
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({ username, password: hashedPassword });
		await user.save();
		return user.id;
	}

	public async login(
		username: string,
		password: string
	): Promise<string | null> {
		const user = await User.findOne({ username });
		if (!user) return null;

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return null;

		const token = jwt.sign(
			{ id: user.id, username: user.username },
			config.jwtSecret!,
			{ expiresIn: "1h" }
		);
		return token;
	}
}

export default new UserService();
