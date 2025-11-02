import * as x509 from "@peculiar/x509";
import { Crypto } from "@peculiar/webcrypto";
import RootCertificate from "./RootCertificate";
import { Config } from "../config";
import { getPathRelativeRoot } from "../utils";
import fs from "fs/promises";
import path from "path";
import { logger } from "../logger";

const config = Config.get();
const crypto = new Crypto();
x509.cryptoProvider.set(crypto);

export class CertificateRevocationList {
  constructor(private rootCA: RootCertificate) {}

  async generate(revokedCertificates: string[] = []): Promise<string> {
    if (!this.rootCA.cert || !this.rootCA.privateKey) {
      throw new Error("Root CA must be loaded before generating CRL");
    }

    const thisUpdate = new Date();
    const nextUpdate = new Date();
    nextUpdate.setFullYear(
      thisUpdate.getFullYear() + config.caConfig.crlConfig.validity_years,
    );

    const revokedEntries = revokedCertificates.map((serialNumber) => ({
      serialNumber,
      revocationDate: new Date(),
    }));

    const crl = await x509.X509CrlGenerator.create({
      issuer: this.rootCA.cert.subject,
      thisUpdate,
      nextUpdate,
      entries: revokedEntries,
      signingAlgorithm: {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      signingKey: this.rootCA.privateKey,
    });

    return crl.toString("pem");
  }

  async generateAndSave(): Promise<void> {
    logger.info("Generating and saving CRL");
    const certificatesDir = getPathRelativeRoot("certificates");
    const devicesDir = path.join(certificatesDir, "devices");

    await fs.mkdir(devicesDir, { recursive: true });

    // check all devices certificates for revoked ones
    const deviceCertFiles = await fs.readdir(devicesDir);
    const revokedCertificates: string[] = [];

    for (const file of deviceCertFiles) {
      // only certificate files
      if (!file.endsWith(".crt")) {
        continue;
      }
      logger.verbose(`Checking device certificate: ${file}`);
      const certPath = path.join(certificatesDir, "devices", file);
      const certPem = await fs.readFile(certPath, "utf-8");
      const cert = new x509.X509Certificate(certPem);

      // check date
      const now = new Date();
      if (now < cert.notBefore || now > cert.notAfter) {
        revokedCertificates.push(cert.serialNumber);
      }
    }
    const crlPem = await this.generate(revokedCertificates);
    // ensure parent paths exist
    await fs.mkdir(certificatesDir, { recursive: true });
    await fs.writeFile(path.join(certificatesDir, "crl.pem"), crlPem);
  }
}
