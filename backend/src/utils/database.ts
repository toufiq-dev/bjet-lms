import mongoose from "mongoose";
import config from "../config";

class Database {
	constructor() {
		this.connect();
	}

	private connect(): void {
		mongoose
			.connect(config.mongoUri!, {
				serverSelectionTimeoutMS: 3000,
			})
			.then(() => {
				console.log("Database connected successfully");
			})
			.catch((err) => {
				console.log("Error connecting to database:", err);
			});
	}
}

export default Database;
