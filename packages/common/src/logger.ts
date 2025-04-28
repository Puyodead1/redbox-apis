import winston from "winston";

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(winston.format.simple()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "server.log" }),
  ],
});

export type Logger = typeof logger;
