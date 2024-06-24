import dotenv from "dotenv";

class Config {
  public readonly port: number;
  public readonly mongoUri: string;
  public readonly jwtSecret: string;

  constructor() {
    dotenv.config();
    this.port = parseInt(process.env.PORT || "8080", 10);
    this.mongoUri = process.env.MONGO_URI || "";
    this.jwtSecret = process.env.JWT_SECRET || "";

    this.validateConfig();
  }

  private validateConfig(): void {
    if (!this.port || !this.mongoUri || !this.jwtSecret) {
      throw new Error("Missing required environment variables");
    }
  }
}

export default new Config();
