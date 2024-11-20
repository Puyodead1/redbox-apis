import { celebrate, Segments } from "celebrate";
import { Request, Response } from "express";
import { v4 } from "uuid";
import { AuthorizeRequest } from "../../interfaces";
import { AuthorizeRequestSchema } from "../../schemas/AuthorizeRequestSchema";
import { AuthorizeResponse, ConfirmationStatus } from "../../types";

export const post = [
    celebrate({
        [Segments.BODY]: AuthorizeRequestSchema,
    }),
    async (req: Request, res: Response) => {
        if (req.method !== "POST") return res.status(405);

        const body: AuthorizeRequest = req.body;

        const MessageId = v4();
        const ReferenceNumber = Math.floor(Math.random() * 1000000);

        return res.json({
            MessageId,
            Success: true,
            Errors: [],
            Email: "user@example.com",
            ReferenceNumber,
            CustomerProfileLastName: "Doe",
            CustomerProfileFirstName: "John",
            Limits: [],
            HasProfile: false,
            CustomerProfileNumber: body.CustomerProfileNumber,
            ConfirmationStatus: ConfirmationStatus.NotSubscribedConfirmed,
            AccountNumber: "1234567890",
            KioskTransactionSuccess: true,
            SubscriptionTransactionSuccess: true,
        } as AuthorizeResponse);
    },
];
