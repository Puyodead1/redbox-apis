import { logger } from "@redbox-apis/common";
import { getPrisma } from "@redbox-apis/db";
import { celebrate, Joi, Segments } from "celebrate";
import { Request, Response } from "express";
import { EncryptionService } from "../../EncryptionService";
import { IOTCertificateValidRequest } from "../../interfaces";
import { IOTCertificateValidRequestSchema } from "../../schemas/IOTCertificateValidRequestSchema";

export const post = [
  celebrate({
    [Segments.BODY]: IOTCertificateValidRequestSchema,
    [Segments.HEADERS]: Joi.object({
      password: Joi.string().required(),
    }).unknown(true),
  }),
  async (req: Request, res: Response) => {
    if (req.method !== "POST") return res.status(405);

    const body = req.body as IOTCertificateValidRequest;
    const password = req.header("password");

    const encryptionService = req.app.locals
      .encryptionService as EncryptionService;

    const kioskId = encryptionService.decrypt(body.name);
    const thingType = encryptionService.decrypt(body.type);
    const certificateId = encryptionService.decrypt(body.certificateId);

    const prisma = await getPrisma();
    const certificate = await prisma.deviceCertificate.findFirst({
      where: {
        certificateId,
        deviceId: kioskId,
      },
    });

    if (!certificate) {
      logger.error(
        `CertificateIsValid failed for kioskId: ${kioskId}, certificateId: ${certificateId}`,
      );
      return res.send("false");
    }

    logger.verbose(
      `CertificateIsValid succeeded for kioskId: ${kioskId}, type: ${thingType}, certificateId: ${certificateId}, kioskPassword: ${password}`,
    );

    return res.send("true");
  },
];
