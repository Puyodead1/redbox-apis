import { celebrate, Segments } from "celebrate";
import { Request, Response } from "express";
import { UpdateMerchandizingStatusRequest } from "../../interfaces";
import { UpdateMerchandizingStatusRequestSchema } from "../../schemas/UpdateMerchandizingStatusRequestSchema";
import { UpdateMerchandizingStatusResponse } from "../../types";

export const post = [
  celebrate({
    [Segments.BODY]: UpdateMerchandizingStatusRequestSchema,
  }),
  async (req: Request, res: Response) => {
    if (req.method !== "POST") return res.status(405);

    const body: UpdateMerchandizingStatusRequest = req.body;

    return res.json({
      Data: [],
    } as UpdateMerchandizingStatusResponse);
  },
];
