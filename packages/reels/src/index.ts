import { logger, loggingMiddleware } from "@redbox-apis/common";
import express from "express";
import { router } from "express-file-routing";

const PORT = 3016;
const app = express();

app.use(express.json());

(async () => {
    app.use(express.json());

    loggingMiddleware(app, logger);

    app.use("/api", await router());

    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
    });
})();
