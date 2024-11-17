import express from "express";
import winston from "winston";

var logger = new winston.Logger({
    transports: [new winston.transports.Console(), new winston.transports.File({ filename: "server.log" })],
});

const PORT = 3012;
const app = express();

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
