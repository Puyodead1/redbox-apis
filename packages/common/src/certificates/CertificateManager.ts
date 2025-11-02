import { getPrisma } from "@redbox-apis/db";
import fs from "fs/promises";
import forge from "node-forge";
import path from "path";
import { generateCertificateId, getPathRelativeRoot } from "../utils";
import { CertificateRevocationList, HashService, logger } from "..";
import RootCertificate from "./RootCertificate";
import BrokerCertificate from "./BrokerCertificate";
import DeviceCertificate from "./DeviceCertificate";

export interface GeneratedDeviceCertificate {
  deviceClientPfx: string;
  certificateId: string;
}

export enum CertificateType {
  Root,
  Leaf,
  Broker,
}

export interface GenerateCertOptions {
  type: CertificateType;
  subject: forge.pki.CertificateField[];
  issuerCert?: forge.pki.Certificate;
  issuerKey?: forge.pki.PrivateKey;
  validityYears?: number;
  serialNumber?: string;
  pathCert: string;
  pathKey: string;
}

export class CertificateManager {
  base: string;
  root: RootCertificate;
  broker: BrokerCertificate;
  crl: CertificateRevocationList;

  constructor() {
    logger.info("Initializing Certificate Manager");
    this.base = getPathRelativeRoot("certificates");
    logger.verbose(`Certificates base path: ${this.base}`);
    this.root = new RootCertificate(
      path.join(this.base, "root.crt"),
      path.join(this.base, "root.key"),
    );
    this.broker = new BrokerCertificate(
      path.join(this.base, "broker.crt"),
      path.join(this.base, "broker.key"),
    );
    this.crl = new CertificateRevocationList(this.root);
  }

  async ensureAll(): Promise<void> {
    logger.info("Ensuring all certificates are present");
    if (!(await this.root.exists())) {
      logger.info("Root certificate not found, generating new one");
      await this.root.generate();
    } else await this.root.load();

    if (!(await this.broker.exists())) {
      logger.info("Broker certificate not found, generating new one");
      await this.broker.generate(this.root);
    } else await this.broker.load();

    await this.crl.generateAndSave();
  }

  /**
   * Generate and return a device certificate
   * @param kioskId kiosk id
   */
  async generateDeviceCertificate(
    kioskId: string,
  ): Promise<GeneratedDeviceCertificate> {
    await this.ensureAll();

    const device = new DeviceCertificate(
      path.join(this.base, "devices", `${kioskId}.crt`),
      path.join(this.base, "devices", `${kioskId}.key`),
    );

    await device.generate(this.root);

    const certificateId = generateCertificateId();
    const hashService = new HashService();
    const password = await hashService.getCertificatePassword(kioskId);

    const privKey = await device.getPrivateKeyForge();
    const cert = await device.getCertificateForge();

    const p12Asn1 = forge.pkcs12.toPkcs12Asn1(privKey, [cert], password, {
      generateLocalKeyId: true,
      friendlyName: kioskId,
      algorithm: "3des",
    });

    const p12Der = forge.asn1.toDer(p12Asn1).getBytes();
    const p12b64 = forge.util.encode64(p12Der);

    return {
      deviceClientPfx: p12b64,
      certificateId,
    };
  }

  /**
   * Save a device certificate to the database, either creating a new record or updating an existing one
   * @param kioskId The kiosk id this certificate is for
   * @param generatedCert The generated device certificate object
   */
  public async saveDeviceCertificate(
    kioskId: string,
    generatedCert: GeneratedDeviceCertificate,
  ): Promise<void> {
    const prisma = await getPrisma();
    await prisma.deviceCertificate.upsert({
      create: {
        certificateId: generatedCert.certificateId,
        deviceId: kioskId,
        devicePfx: generatedCert.deviceClientPfx,
      },
      update: {
        devicePfx: generatedCert.deviceClientPfx,
      },
      where: {
        deviceId: kioskId,
      },
    });
  }

  /**
   * Saves the device certificate to a file ready for installation on kiosks
   * @param kioskId The kiosk id this certificate is for
   * @param generatedCert The generated device certificate object
   * @returns The path to the exported file
   */
  public async exportDeviceCertificate(
    kioskId: string,
    generatedCert: GeneratedDeviceCertificate,
  ): Promise<string> {
    // ensure the root certificate is loaded
    await this.ensureAll();

    const data = {
      CertificateId: generatedCert.certificateId,
      DeviceCertPfxBase64: generatedCert.deviceClientPfx,
      RootCa: this.root.getCertificatePEM(),
    };
    await fs.mkdir(this.base, { recursive: true });
    const finalPath = path.join(
      this.base,
      "devices",
      `${kioskId}_iotcertificatedata.json`,
    );
    await fs.writeFile(finalPath, JSON.stringify(data));
    return finalPath;
  }
}
