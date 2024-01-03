import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logger = winston.createLogger({
  level: "debug", // Set the minimum level to log (error, info, debug)
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    new DailyRotateFile({
      filename: "logs/xpass-%DATE%.log", // Log file pattern
      datePattern: "YYYY-MM-DD", // Rotate daily
      zippedArchive: true,
      maxSize: "20m", // Max size of each log file
      maxFiles: "14d", // Retain logs for 14 days
    }),
  ],
});

export default logger;
