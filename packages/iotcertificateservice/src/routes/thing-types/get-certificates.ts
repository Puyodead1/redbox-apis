import { logger } from "@redbox-apis/common";
import { getPrisma } from "@redbox-apis/db";
import { celebrate, Joi, Segments } from "celebrate";
import { Request, Response } from "express";
import { EncryptionService } from "../../EncryptionService";
import { IOTCertificatesRequest } from "../../interfaces";
import { IOTCertificatesRequestSchema } from "../../schemas/IOTCertificatesRequestSchema";

export const post = [
  celebrate({
    [Segments.BODY]: IOTCertificatesRequestSchema,
    [Segments.HEADERS]: Joi.object({
      password: Joi.string().required(),
    }).unknown(true),
  }),
  async (req: Request, res: Response) => {
    if (req.method !== "POST") return res.status(405);

    const body = req.body as IOTCertificatesRequest;
    const password = req.header("password");

    const encryptionService = req.app.locals
      .encryptionService as EncryptionService;

    const kioskId = encryptionService.decrypt(body.name);
    const thingType = encryptionService.decrypt(body.type);

    const prisma = await getPrisma();
    const certificate = await prisma.deviceCertificate.findFirst({
      where: {
        deviceId: kioskId,
      },
    });

    // if certificate exists, return it
    if (certificate) {
      return res.json({
        DeviceCertPfxBase64: certificate.devicePfx,
        CertificateId: certificate.certificateId,
        RootCa: req.app.locals.certManager.root.getCertificatePEM(),
      });
    }

    // create a new certificate for the device, doing this will allow the kiosk to automatically get a certificate and "install" it to the device
    logger.info(`No certificate for kiosk ${kioskId}, generating new one`);

    const generated: { deviceClientPfx: string; certificateId: string } =
      await req.app.locals.certManager.generateDeviceCertificate(kioskId);

    await prisma.deviceCertificate.create({
      data: {
        certificateId: generated.certificateId,
        deviceId: kioskId,
        devicePfx: generated.deviceClientPfx,
      },
    });

    logger.info(
      `Generated new certificate for kioskId: ${kioskId}, certificateId: ${generated.certificateId}`,
    );

    return res.json({
      DeviceCertPfxBase64: generated.deviceClientPfx,
      CertificateId: generated.certificateId,
      RootCa: req.app.locals.certManager.root.getCertificatePEM(),
    });
  },
];
