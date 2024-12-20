import { logger, loggingMiddleware } from "@redbox-apis/common";
import express from "express";

const PORT = 3014;
const app = express();

app.use(express.json());

loggingMiddleware(app, logger);

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
