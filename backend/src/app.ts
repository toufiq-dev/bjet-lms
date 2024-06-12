import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/UserRoutes';
import Database from './utils/Database';

class App {
  public app: express.Application;
  public database: Database;

  constructor() {
    this.app = express();
    this.database = new Database();
    this.config();
    this.routes();
  }

  private config(): void {
    this.app.use(bodyParser.json());
  }

  private routes(): void {
    this.app.use('/api/users', userRoutes);
}
}

export default new App().app;
