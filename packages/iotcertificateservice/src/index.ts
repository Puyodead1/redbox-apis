import { Config, KeyService, logger, loggingMiddleware } from "@redbox-apis/common";
import { errors } from "celebrate";
import express from "express";
import { router } from "express-file-routing";
import { EncryptionService } from "./EncryptionService";

const config = Config.get();
const app = express();

const PORT = config.iotCertificateServiceConfig.port;
const HOST = config.iotCertificateServiceConfig.host;

+(async () => {
    const keyService = new KeyService();
    const encryptionService = new EncryptionService();

    await keyService.loadRootCA();

    app.locals.encryptionService = encryptionService;
    app.locals.keyService = keyService;

    app.use(express.json());

    loggingMiddleware(app, logger);

    app.use("/api", await router());

    app.use(errors());

    app.listen(PORT, HOST, () => {
        logger.info(`Server is running on port ${PORT}`);
    });
})();
