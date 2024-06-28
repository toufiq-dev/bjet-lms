import dotenv from "dotenv";

class Config {
  public readonly port: number;
  public readonly mongoUri: string;
  public readonly jwtSecret: string;
  public readonly refreshTokenSecret: string;
  public readonly redisUrl: string;
  public readonly accessTokenExpiration: number;
  public readonly refreshTokenExpiration: number;

  constructor() {
    dotenv.config();
    this.port = parseInt(process.env.PORT || "8080", 10);
    this.mongoUri = process.env.MONGO_URI || "";
    this.jwtSecret = process.env.JWT_SECRET || "";
    this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "";
    this.redisUrl = process.env.REDIS_URL || "redis://redis:6379";
    this.refreshTokenExpiration = 7 * 24 * 60 * 60;
    this.accessTokenExpiration = 15 * 60 * 1000;

    this.validateConfig();
  }

  private validateConfig(): void {
    if (
      !this.port ||
      !this.mongoUri ||
      !this.jwtSecret ||
      !this.refreshTokenSecret ||
      !this.redisUrl
    ) {
      throw new Error("Missing required environment variables");
    }
  }
}

export default new Config();
