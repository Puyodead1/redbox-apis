import { logger } from "@redbox-apis/common";
import { getPrisma } from "@redbox-apis/db";
import { celebrate, Segments } from "celebrate";
import { Request, Response } from "express";
import { KioskStatisticsRequest } from "../../interfaces";
import { KioskStatisticsRequestSchema } from "../../schemas/KioskStatisticsRequestSchema";

export const post = [
  celebrate({
    [Segments.BODY]: KioskStatisticsRequestSchema,
  }),
  async (req: Request, res: Response) => {
    if (req.method !== "POST") return res.status(405);

    const { KioskId, Statistics }: KioskStatisticsRequest = req.body;
    if (!KioskId) {
      logger.warn(
        "No KioskId provided in kiosk statistics request, tf are we supposed to do??",
      );
      return res.status(400).json({ error: "no kiosk id??" });
    }
    const prisma = await getPrisma();

    // merge existing kiosk statistics with new statistics
    const existingStatistics = await prisma.statistics.findFirst({
      where: {
        KioskId,
      },
    });

    if (existingStatistics) {
      logger.info(`Updating statistics for kiosk ${KioskId}`);
      await prisma.statistics.update({
        where: {
          KioskId: existingStatistics.KioskId,
        },
        data: {
          ...existingStatistics,
          ...Statistics,
        },
      });
    } else {
      logger.info(`Creating statistics for kiosk ${KioskId}`);
      await prisma.statistics.create({
        data: {
          KioskId,
          ...Statistics,
        },
      });
    }

    return res.sendStatus(200);
  },
];
