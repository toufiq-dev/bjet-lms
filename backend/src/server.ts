import app from "./app";
import config from "./config";
import { logger } from "./utils/logger";

const PORT = config.port;

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: any) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
