import { celebrate, Segments } from "celebrate";
import { prisma } from "db";
import { Request, Response } from "express";
import { KioskStatisticsRequest } from "../../interfaces";
import { KioskStatisticsRequestSchema } from "../../schemas/KioskStatisticsSchema";

export const post = [
    celebrate({
        [Segments.BODY]: KioskStatisticsRequestSchema,
    }),
    async (req: Request, res: Response) => {
        if (req.method !== "POST") return res.status(405);

        const { KioskId, Statistics }: KioskStatisticsRequest = req.body;

        await prisma.statistics.upsert({
            where: {
                KioskId,
            },
            update: {
                ...Statistics,
            },
            create: {
                KioskId,
                ...Statistics,
            },
        });

        return res.sendStatus(200);
    },
];
