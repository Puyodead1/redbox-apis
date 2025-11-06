import { Application, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { Logger } from "winston";

// export const loggingMiddleware = (app: Application, logger: Logger) => {
//   app.use((req: Request, res: Response, next: NextFunction) => {
//     logger.verbose("Request received", {
//       timestamp: new Date().toISOString(),
//       method: req.method,
//       url: req.originalUrl,
//       headers: req.headers,
//       body: req.body,
//     });
//     next();
//   });
// };

export const loggingMiddleware = (app: Application, logger: Logger) => {
  app.use(morgan("combined"));
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.debug("----------------------------------");
    logger.debug(req.url);
    logger.debug(JSON.stringify(req.headers, null, 4));
    if (req.body) logger.debug(JSON.stringify(req.body, null, 4));
    logger.debug("----------------------------------");
    next();
  });
};
