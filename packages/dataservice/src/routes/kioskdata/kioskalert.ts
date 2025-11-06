import { celebrate, Segments } from "celebrate";
import { Request, Response } from "express";
import { KioskAlertRequestSchema } from "../../schemas/KioskAlertRequestSchema";
import StandardResponse from "../../schemas/StandardResponse";

export const post = [
  celebrate({
    [Segments.BODY]: KioskAlertRequestSchema,
  }),
  async (req: Request, res: Response) => {
    if (req.method !== "POST") return res.status(405);

    res.json({
      Success: true,
      Errors: [],
      StatusCode: 200,
    } as StandardResponse);
  },
];
