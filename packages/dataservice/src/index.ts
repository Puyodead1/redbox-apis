import { Config, logger, loggingMiddleware } from "@redbox-apis/common";
import { getPrisma } from "@redbox-apis/db";
import { errors } from "celebrate";
import express from "express";
import { router } from "express-file-routing";

const config = Config.get();
const app = express();

const PORT = config.dataServiceConfig.port;
const HOST = config.dataServiceConfig.host;

(async () => {
  await getPrisma();
  app.use(express.json());

  loggingMiddleware(app, logger);

  app.use("/api", await router());

  app.use(errors());

  app.listen(PORT, HOST, () => {
    logger.info(`Server is listening on  ${HOST}:${PORT}`);
  });
})();
