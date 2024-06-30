import { createLogger, format, transports } from "winston";
import morgan from "morgan";
import path from "path";
import fs from "fs";

const logDirectory = path.join(__dirname, "../../logs");

// Create the logs directory if it does not exist
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const logFormat = format.combine(
  format.timestamp(),
  format.printf(
    ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
  )
);

const logger = createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(logDirectory, "error.log"),
      level: "error",
      format: logFormat,
    }),
    new transports.File({
      filename: path.join(logDirectory, "combined.log"),
      format: logFormat,
    }),
  ],
});

const stream = {
  write: (message: string) => logger.info(message.trim()),
};

const requestLogger = morgan("combined", { stream });

export { logger, requestLogger };
