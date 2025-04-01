import { logger } from "@redbox-apis/common";
import { celebrate, Segments } from "celebrate";
import { Request, Response } from "express";
import { KioskAlertRequest } from "../../interfaces";
import StandardResponse from "../../interfaces/StandardResponse";
import { KioskAlertRequestSchema } from "../../schemas/KioskAlertRequestSchema";

export const post = [
    celebrate({
        [Segments.BODY]: KioskAlertRequestSchema,
    }),
    async (req: Request, res: Response) => {
        if (req.method !== "POST") return res.status(405);
        const alert = req.body as KioskAlertRequest;

        logger.debug("Kiosk Alert Received:");
        logger.debug(`Kiosk ID: ${alert.KioskId}`);
        logger.debug(`Message ID: ${alert.MessageId}`);
        logger.debug(`Alert Type: ${alert.AlertType}`);
        logger.debug(`Sub Alert Type: ${alert.SubAlertType}`);
        logger.debug(`Alert Message: ${alert.AlertMessage}`);
        logger.debug(`Created On: ${alert.CreatedOn}`);
        logger.debug(`Created On Local: ${alert.CreatedOnLocal}`);
        logger.debug(`Send To Table: ${alert.SendToTable}`);
        logger.debug(`Unique ID: ${alert.UniqueId}`);

        res.json({
            Success: true,
            Errors: [],
            StatusCode: 200,
        } as StandardResponse);
    },
];
