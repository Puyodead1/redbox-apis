import express from "express";
import winston from "winston";

const logger = winston.createLogger({
    level: "info", // Set the default logging level
    format: winston.format.combine(
        winston.format.simple() // You can choose other formats like JSON
    ),
    transports: [
        new winston.transports.Console(), // Log to the console
        new winston.transports.File({ filename: "server.log" }), // Log to a file
    ],
});

const PORT = 3012;
const app = express();

app.use((req, res, next) => {
    logger.info("Request received", {
        method: req.method,
        url: req.originalUrl,
        body: req.body,
    });
    next();
});

app.get("/api/installer/getpendingstates", (req, res) => {
    res.json({
        States: [
            {
                Id: "state1",
                Description: "State 1",
            },
        ],
    });
});

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
