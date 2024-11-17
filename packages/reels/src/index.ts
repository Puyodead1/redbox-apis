import express from "express";
import winston from "winston";

var logger = new winston.Logger({
    transports: [new winston.transports.Console(), new winston.transports.File({ filename: "server.log" })],
});

const PORT = 3016;
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    logger.info(req.method, req.originalUrl, req.body);
    next();
});

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
