import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

class Database {
  constructor() {
    this.connect();
  }

  private connect(): void {
    mongoose
      .connect(process.env.MONGO_URI!, {
        serverSelectionTimeoutMS: 3000, // Timeout after 5s instead of 30s
      })
      .then(() => {
        console.log('Database connected successfully');
      })
      .catch((err) => {
        console.log('Error connecting to database:', err);
      });
  }
}

export default Database;