import { Config, logger, loggingMiddleware } from "@redbox-apis/common";
import { errors } from "celebrate";
import express from "express";
import { router } from "express-file-routing";

const config = Config.get();
const app = express();

const PORT = config.kioskInventoryServiceConfig.port;
const HOST = config.kioskInventoryServiceConfig.host;

(async () => {
  app.use(express.json());

  loggingMiddleware(app, logger);

  app.use("/api", await router());

  app.use(errors());

  app.listen(PORT, HOST, () => {
    logger.info(`Server is listening on  ${HOST}:${PORT}`);
  });
})();
