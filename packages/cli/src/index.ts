// Soon

import { KeyService } from "@redbox-apis/common";
import { getPrisma } from "@redbox-apis/db";
import fs from "fs/promises";

(async () => {
    const keyService = new KeyService();
    console.log("[KeyService] Loading RootCA...");
    await keyService.loadRootCA();
    console.log("[KeyService] RootCA Loaded");

    const kioskId = "59394";
    const generated = await keyService.generateDeviceCertificate(kioskId);

    const prisma = await getPrisma();
    await prisma.deviceCertificate.upsert({
        create: {
            certificateId: generated.certificateId,
            deviceId: kioskId,
            devicePfx: generated.deviceClientPfx,
        },
        update: {
            devicePfx: generated.deviceClientPfx,
        },
        where: {
            deviceId: kioskId,
        },
    });

    const data = {
        CertificateId: generated.certificateId,
        DeviceCertPfxBase64: generated.deviceClientPfx,
        RootCa: await keyService.getRootCA(),
    };
    await fs.writeFile("iotcertificatedata.json", JSON.stringify(data));
    console.log("Device certificate generated");
})();
