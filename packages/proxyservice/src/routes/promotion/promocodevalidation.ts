import { getPrisma } from "@redbox-apis/db";
import { celebrate, Segments } from "celebrate";
import { Request, Response } from "express";
import { v4 } from "uuid";
import { PromoCodeValidationRequest } from "../../interfaces";
import { PromoCodeValidationRequestSchema } from "../../schemas";
import PromoCodeValidationResponse from "../../types/PromoCodeValidationResponse";

export const post = [
    celebrate({
        [Segments.BODY]: PromoCodeValidationRequestSchema,
    }),
    async (req: Request, res: Response) => {
        if (req.method !== "POST") return res.status(405);

        const { Code, KioskId } = req.body as PromoCodeValidationRequest;

        const prisma = await getPrisma();
        const promoCode = await prisma.promoCode.findUnique({
            where: {
                code: Code,
            },
        });

        if (!promoCode) {
            return res.status(404).json({
                Errors: [
                    {
                        Code: "PromoCodeNotFound",
                        Message: "Invalid promo code",
                    },
                ],
            });
        }

        return res.json({
            MessageId: v4(),
            KioskId,
            Error: "",
            Amount: promoCode.amount,
            PromotionIntentCode: promoCode.promotionIntent,
            RentQty: promoCode.rentQty,
            RentFormat: promoCode.rentFormat,
            GetQty: promoCode.getQty,
            GetFormat: promoCode.getFormat,
            CampaignTitles: promoCode.campaignTitles
                ? {
                      Include: true,
                      Titles: promoCode.campaignTitles,
                  }
                : [],
            ProductTypeId: promoCode.productTypeId,
            FormatIds: promoCode.formatIds,
            ActionType: promoCode.actionType,
            AllowFullDiscount: promoCode.allowFullDiscount,
            DefaultPromo: {
                PromoCode: promoCode.code,
                PromotionIntentCode: promoCode.promotionIntent,
                Amount: promoCode.amount,
            },
        } as PromoCodeValidationResponse);
    },
];
