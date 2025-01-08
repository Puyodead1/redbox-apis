import { logger, loggingMiddleware } from "@redbox-apis/common";
import { getPrisma } from "@redbox-apis/db";
import { errors } from "celebrate";
import express from "express";
import { router } from "express-file-routing";

const PORT = 3012;
const app = express();

(async () => {
    await getPrisma();
    app.use(express.json());

    loggingMiddleware(app, logger);

    app.use("/api", await router());

    app.use(errors());

    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
    });
})();
