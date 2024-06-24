import { createLogger, format, transports } from "winston";
import morgan from "morgan";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
    )
  ),
  transports: [new transports.Console()],
});

const stream = {
  write: (message: string) => logger.info(message.trim()),
};

const requestLogger = morgan("combined", { stream });

export { logger, requestLogger };
