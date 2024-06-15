import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
};

if (!config.port || !config.mongoUri || !config.jwtSecret) {
  throw new Error("Missing required environment variables");
}

export default config;
