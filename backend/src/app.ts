import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import userProfileRoutes from "./routes/userProfileRoutes";
import Database from "./utils/database";
import { errorMiddleware, notFoundMiddleware } from "./utils/errorHandler";
import { requestLogger, logger } from "./utils/logger";
import config from "./config";
import { connectRedis } from "./utils/redis";
import { startEmailService } from "./utils/sendEmail";
import courseRoutes from "./routes/courseRoutes";
import lessonRoutes from "./routes/lessonRoutes";
import moduleRoutes from "./routes/moduleRoutes";

class App {
  private express: express.Application;
  private database: Database;

  constructor() {
    this.express = express();
    this.database = Database.getInstance();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.express.use(helmet());
    this.express.use(bodyParser.json());
    this.express.use(cookieParser());
    this.express.use(requestLogger);
    this.express.use(
      cors({ origin: "http://localhost:5173", credentials: true })
    );
  }

  private initializeRoutes(): void {
    this.express.use("/api/users", userRoutes);
    this.express.use("/api/user-profiles", userProfileRoutes);
    this.express.use("/api/courses", courseRoutes);
    this.express.use("/api/modules", moduleRoutes);
    this.express.use("/api/lessons", lessonRoutes);
  }

  private initializeErrorHandling(): void {
    this.express.use(notFoundMiddleware);
    this.express.use(errorMiddleware);
  }

  public async start(): Promise<void> {
    try {
      await this.database.connect();
      await connectRedis();
      await startEmailService();

      this.express.listen(config.port, () => {
        logger.info(`Server is running on port ${config.port}`);
      });
    } catch (error) {
      logger.error("Failed to start the server", error);
      throw error;
    }
  }

  public async stop(): Promise<void> {
    await this.database.disconnect();
  }
}

export default new App();
