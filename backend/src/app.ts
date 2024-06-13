import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import userRoutes from "./routes/UserRoutes";
import Database from "./utils/Database";
import { errorMiddleware } from "./utils/errorHandler";
import requestLogger from "./middleware/logger";

class App {
  public app: express.Application;
  public database: Database;

  constructor() {
    this.app = express();
    this.database = new Database();
    this.config();
    this.routes();
    this.app.use(errorMiddleware);
  }

  private config(): void {
    this.app.use(helmet());
    this.app.use(bodyParser.json());
    this.app.use(requestLogger);
  }

  private routes(): void {
    this.app.use("/api/users", userRoutes);
  }
}

export default new App().app;
