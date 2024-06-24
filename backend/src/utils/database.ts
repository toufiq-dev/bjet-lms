import mongoose from "mongoose";
import config from "../config";
import { logger } from "./logger";

class Database {
  private static instance: Database;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(config.mongoUri!, {
        serverSelectionTimeoutMS: 3000,
      });
      logger.info("Database connected successfully");
    } catch (err) {
      logger.error("Error connecting to database:", err);
      throw err;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      logger.info("Database disconnected successfully");
    } catch (err) {
      logger.error("Error disconnecting from database:", err);
      throw err;
    }
  }
}

export default Database;
