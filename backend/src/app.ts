import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/userRoutes";
import Database from "./utils/database";
import { errorMiddleware, notFoundMiddleware } from "./utils/errorHandler";
import { requestLogger } from "./utils/logger";

class App {
  public app: express.Application;
  public database: Database;

  constructor() {
    this.app = express();
    this.database = new Database();
    this.config();
    this.routes();
    this.app.use(notFoundMiddleware);
    this.app.use(errorMiddleware);
  }

  private config(): void {
    this.app.use(helmet());
    this.app.use(bodyParser.json());
    this.app.use(requestLogger);
    this.app.use(
      cors({
        origin: "http://localhost:3000",
      })
    );
  }

  private routes(): void {
    this.app.use("/api/users", userRoutes);
  }
}

export default new App().app;
