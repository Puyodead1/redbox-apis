// Soon

import { KeyService } from "@redbox-apis/common";
import fs from "fs/promises";

(async () => {
    const keyService = new KeyService();
    console.log("[KeyService] Loading RootCA...");
    await keyService.loadRootCA();
    console.log("[KeyService] RootCA Loaded");

    const deviceCert = await keyService.generateDeviceCertificate("59394");
    const data = {
        CertificateId: deviceCert.certificateId,
        DeviceCertPfxBase64: deviceCert.deviceClientPfx,
        RootCa: await keyService.getRootCA(),
    };
    await fs.writeFile("../../iotcertificatedata.json", JSON.stringify(data));
    console.log("Device certificate generated");
})();
