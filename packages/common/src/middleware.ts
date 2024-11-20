import { Application, NextFunction, Request, Response } from "express";
import { Logger } from "winston";

export const loggingMiddleware = (app: Application, logger: Logger) => {
    app.use((req: Request, res: Response, next: NextFunction) => {
        logger.info("Request received", {
            method: req.method,
            url: req.originalUrl,
            body: req.body,
        });
        next();
    });
};
