import { logger, loggingMiddleware } from "@redbox-apis/common";
import { getPrisma } from "@redbox-apis/db";
import express from "express";

const PORT = 3013;
const app = express();

app.use(express.json());

loggingMiddleware(app, logger);

app.listen(PORT, async () => {
    logger.info(`Server is running on port ${PORT}`);
    await getPrisma();
});
