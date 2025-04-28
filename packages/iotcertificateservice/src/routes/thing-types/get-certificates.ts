import { logger } from "@redbox-apis/common";
import { getPrisma } from "@redbox-apis/db";
import { celebrate, Joi, Segments } from "celebrate";
import { Request, Response } from "express";
import { EncryptionService } from "../../EncryptionService";
import { IOTCertificateGenerateRequest } from "../../interfaces";
import { IOTCertificateGenerateRequestSchema } from "../../schemas/IOTCertificateGenerateRequestSchema";

export const post = [
  celebrate({
    [Segments.BODY]: IOTCertificateGenerateRequestSchema,
    [Segments.HEADERS]: Joi.object({
      password: Joi.string().required(),
    }).unknown(true),
  }),
  async (req: Request, res: Response) => {
    if (req.method !== "POST") return res.status(405);

    const body = req.body as IOTCertificateGenerateRequest;
    const password = req.header("password");

    const encryptionService = req.app.locals
      .encryptionService as EncryptionService;

    const kioskId = encryptionService.decrypt(body.name);
    const thingType = encryptionService.decrypt(body.type);

    logger.info(
      `GetCertificates for kioskId: ${kioskId}, type: ${thingType}, kioskPassword: ${password}`,
    );

    const prisma = await getPrisma();
    const certificate = await prisma.deviceCertificate.findFirst({
      where: {
        deviceId: kioskId,
      },
    });

    if (!certificate) {
      return res.status(404).json({
        message: `No certificate found for kioskId: ${kioskId}`,
      });
    }

    logger.debug(
      `Generated certificate for kioskId: ${kioskId}, certificateId: ${certificate.certificateId}`,
    );

    return res.json({
      DeviceCertPfxBase64: certificate.devicePfx,
      CertificateId: certificate.certificateId,
      RootCa: req.app.locals.keyService.getRootCA(),
    });
  },
];
