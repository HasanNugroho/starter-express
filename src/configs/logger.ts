import winston from 'winston';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define the logger configuration
const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.json(),
  winston.format.printf(
    ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
  )
);

const logLevel = process.env.LOG_LEVEL || 'info';

// Create and configure the logger
const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  transports: [
    new winston.transports.Console({
      level: logLevel,
    }),
  ],
});

// Export the logger instance
export default logger;
