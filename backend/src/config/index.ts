import dotenv from "dotenv";
import path from "path";

class Config {
  public readonly port: number;
  public readonly mongoUri: string;
  public readonly jwtSecret: string;
  public readonly refreshTokenSecret: string;
  public readonly redisUrl: string;
  public readonly accessTokenExpiration: number;
  public readonly refreshTokenExpiration: number;
  public readonly maxInvalidLoginAttempts: number;
  public readonly lockDuration: number;
  public readonly rabbitMQUrl: string;
  public readonly emailHost: string;
  public readonly emailPort: string;
  public readonly emailUser: string;
  public readonly emailPass: string;
  public readonly uploadDir: string;
  public readonly pdfDir: string;
  public readonly videoDir: string;
  public readonly forgotPassLinkExpiration: number;
  public readonly frontendUrl: string;

  constructor() {
    dotenv.config();
    this.port = parseInt(process.env.PORT || "", 10);
    this.mongoUri = process.env.MONGO_URI || "";
    this.jwtSecret = process.env.JWT_SECRET || "";
    this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "";
    this.redisUrl = process.env.REDIS_URL || "";
    this.refreshTokenExpiration = 7 * 24 * 60 * 60 * 1000;
    this.accessTokenExpiration = 15 * 60 * 1000;
    this.maxInvalidLoginAttempts = 5;
    this.lockDuration = 60 * 60 * 1000;
    this.rabbitMQUrl = process.env.RABBITMQ_URL || "";
    this.emailHost = process.env.EMAIL_HOST || "";
    this.emailPort = process.env.EMAIL_PORT || "";
    this.emailUser = process.env.EMAIL_USER || "";
    this.emailPass = process.env.EMAIL_PASS || "";
    this.uploadDir = path.join(__dirname, "../../uploads");
    this.pdfDir = path.join(this.uploadDir, "pdf");
    this.videoDir = path.join(this.uploadDir, "video");
    this.forgotPassLinkExpiration = 15 * 60;
    this.frontendUrl = process.env.FRONTEND_URL || "";

    this.validateConfig();
  }

  private validateConfig(): void {
    if (
      !this.port ||
      !this.mongoUri ||
      !this.jwtSecret ||
      !this.refreshTokenSecret ||
      !this.redisUrl ||
      !this.uploadDir
    ) {
      throw new Error("Missing required environment variables");
    }
  }
}

export default new Config();
