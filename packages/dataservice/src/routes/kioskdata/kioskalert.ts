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

        console.log("Kiosk Alert Received:");
        console.log(`Kiosk ID: ${alert.KioskId}`);
        console.log(`Message ID: ${alert.MessageId}`);
        console.log(`Alert Type: ${alert.AlertType}`);
        console.log(`Sub Alert Type: ${alert.SubAlertType}`);
        console.log(`Alert Message: ${alert.AlertMessage}`);
        console.log(`Created On: ${alert.CreatedOn}`);
        console.log(`Created On Local: ${alert.CreatedOnLocal}`);
        console.log(`Send To Table: ${alert.SendToTable}`);
        console.log(`Unique ID: ${alert.UniqueId}`);

        res.json({
            Success: true,
            Errors: [],
            StatusCode: 200,
        } as StandardResponse);
    },
];
