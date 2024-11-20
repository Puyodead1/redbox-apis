import { logger, loggingMiddleware } from "common";
import express from "express";
import { router } from "express-file-routing";

const PORT = 3015;
const app = express();

(async () => {
    app.use(express.json());

    loggingMiddleware(app, logger);

    app.use("/api", await router());

    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
    });
})();
