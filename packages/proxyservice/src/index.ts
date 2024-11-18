import express, { NextFunction, Request, Response } from "express";
import { query, ValidationChain, validationResult } from "express-validator";
import winston from "winston";
import {
    IGetPlanogramsResponse,
    IPendingBannersResponse,
    IPendingKiosksResponse,
    IPendingStatesResponse,
} from "./types";

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

const validateRequest = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map((validation) => validation.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        next();
    };
};

app.use((req, res, next) => {
    logger.info("Request received", {
        method: req.method,
        url: req.originalUrl,
        body: req.body,
    });
    next();
});

app.get("/api/installer/getpendingstates", (req, res) => {
    // TODO: I dont really see the point of implementing this
    res.json({
        States: [
            {
                Id: 1,
                Description: "State 1",
            },
        ],
    } as IPendingStatesResponse);
});

app.get("/api/installer/getpendingbanners", validateRequest([query("stateid").notEmpty()]), (req, res) => {
    // TODO: I dont really see the point of implementing this
    const stateId = req.query!.stateid;

    res.json({
        Banners: [
            {
                Id: 1,
                Name: "Banner 1",
            },
        ],
    } as IPendingBannersResponse);
});

app.get(
    "/api/installer/getpendingkiosks",
    validateRequest([query("stateid").notEmpty(), query("bannerid").notEmpty()]),
    (req, res) => {
        // TODO: I dont really see the point of implementing this
        const stateId = req.query!.stateid;
        const bannerId = req.query!.bannerid;

        res.json({
            PendingKiosks: [
                {
                    Id: 1,
                    Address: "11111",
                    City: "idk",
                    State: "yes",
                    ZipCode: "66666",
                    DueTime: "9:00",
                    MarketName: "Dollar General",
                    KaseyaMarketName: "toleto_oh",
                },
            ],
        } as IPendingKiosksResponse);
    }
);

app.get("/api/planogram/allcurrent", validateRequest([query("lastReportedTime").notEmpty()]), (req, res) => {
    const lastReportedTime = req.query!.lastReportedTime;

    res.json({
        Planograms: [],
    } as IGetPlanogramsResponse);
});

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
