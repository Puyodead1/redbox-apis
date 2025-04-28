import { Application, NextFunction, Request, Response } from "express";
import { Logger } from "winston";

export const loggingMiddleware = (app: Application, logger: Logger) => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.verbose("Request received", {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
    });
    next();
  });
};
