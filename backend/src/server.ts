import app from "./app";
import { logger } from "./utils/logger";

const startServer = async () => {
  try {
    await app.start();
  } catch (error) {
    logger.error("Failed to start the server", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: any) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

startServer();
