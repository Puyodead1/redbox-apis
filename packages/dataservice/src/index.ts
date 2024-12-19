import { logger, loggingMiddleware } from "common";
import { getPrisma } from "db";
import express from "express";

const PORT = 3013;
const app = express();

app.use(express.json());

loggingMiddleware(app, logger);

app.listen(PORT, async () => {
    logger.info(`Server is running on port ${PORT}`);
    await getPrisma();
});
