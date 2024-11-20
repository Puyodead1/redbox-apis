import winston from "winston";

export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(winston.format.simple()),
    transports: [new winston.transports.Console(), new winston.transports.File({ filename: "server.log" })],
});
