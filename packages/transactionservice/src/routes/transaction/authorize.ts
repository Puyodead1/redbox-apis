import { celebrate, Segments } from "celebrate";
import { Request, Response } from "express";
import { v4 } from "uuid";
import { AuthorizeRequest } from "../../interfaces";
import { AuthorizeRequestSchema } from "../../schemas/AuthorizeRequestSchema";
import { AuthorizeResponse, AuthorizeType, ConfirmationStatus, GiftCardStatus } from "../../types";

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
            SessionId: "00000000-0000-0000-0000-000000000000",
            AuthorizeType: AuthorizeType.Authorize,
            IsOnline: true,
            StandAlone: false,
            ServerName: "TransactionService",
            Response: "Success",
            Email: "user@example.com",
            ReferenceNumber,
            HasProfile: false,
            IsRBI: false,
            FirstName: "John",
            LastName: "Doe",
            ConfirmationStatus: ConfirmationStatus.NotSubscribedConfirmed,
            AccountNumber: "1234567890",
            CustomerProfileNumber: body.CustomerProfileNumber,
            StoreNumber: req.headers["x-redbox-kioskid"] as string,
            GiftCardExists: true,
            GiftCardStatus: GiftCardStatus.Registered,
            GiftCardBalance: 999999.99,
            GiftCardMaxDiscs: 99999999,
            GiftCardMaxGames: 5999999,
            KioskTransactionSuccess: true,
            SubscriptionTransactionSuccess: true,
            Errors: [],
            Success: true,
        } as AuthorizeResponse);
    },
];
