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
                Id: 1,
                Description: "State 1",
            },
        ],
    });
});

app.get("/api/installer/getpendingbanners", (req, res) => {
    // get stateid from query params
    const stateId = req.query.stateid;
    if (!stateId) {
        res.status(400).json({ error: "stateid is required" });
        return;
    }

    res.json({
        Banners: [
            {
                Id: 1,
                Name: "Banner 1",
            },
        ],
    });
});

app.get("/api/installer/getpendingkiosks", (req, res) => {
    // get stateid and banner id from query params
    const stateId = req.query.stateid;
    const bannerId = req.query.bannerid;
    if (!stateId || !bannerId) {
        res.status(400).json({ error: "stateid and banner are required" });
        return;
    }

    res.json({
        PendingKiosks: [
            {
                Id: 1,
                Address: "somewhere",
                City: "some city",
                State: "some state",
                ZipCode: "66666",
                DueTime: "9:00",
                MarketName: "Dollar General",
                KaseyaMarketName: "toleto_oh",
            },
        ],
    });
});

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
