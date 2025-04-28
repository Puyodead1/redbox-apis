import { getPrisma } from "@redbox-apis/db";
import fs from "fs/promises";
import forge from "node-forge";
import path from "path";
import { HashService } from "./HashService";
import { logger } from "./logger";
import { findRoot, generateCertificateId } from "./utils";

export interface GeneratedDeviceCertificate {
  deviceClientPfx: string;
  certificateId: string;
}

export class KeyService {
  private readonly ROOT_CA_PATH = "../../RootCA.crt";
  private readonly ROOT_CA_KEY_PATH = "../../RootCA.key";

  private rootCertificate!: forge.pki.Certificate;
  private rootPrivateKey!: forge.pki.PrivateKey;

  /**
   * Check if the root CA exists on the file system
   * @returns Boolean indicating if the root CA exists
   */
  public async rootCAExists(): Promise<boolean> {
    try {
      await fs.access(this.ROOT_CA_PATH);
      await fs.access(this.ROOT_CA_KEY_PATH);

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Return the root CA certificate as a PEM string
   * @returns The root CA certificate as a PEM string
   */
  public getRootCA(): string {
    return forge.pki
      .certificateToPem(this.rootCertificate)
      .replaceAll("\r\n", "\n");
  }

  /**
   * Generate a new root CA certificate and private key
   */
  public async generateRootCA(): Promise<void> {
    const keys = forge.pki.rsa.generateKeyPair(2048);
    const cert = forge.pki.createCertificate();

    cert.publicKey = keys.publicKey;
    cert.serialNumber = "01";
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(
      cert.validity.notBefore.getFullYear() + 10,
    );

    const attrs = [
      {
        shortName: "C",
        value: "US",
      },
      {
        shortName: "L",
        value: "Oakbrook Terrace",
      },
      {
        shortName: "ST",
        value: "Ohio",
      },
      {
        name: "organizationName",
        value: "Not Redbox lol",
      },
      {
        shortName: "OU",
        value: "Redbox IoT Service",
      },
    ];

    cert.setSubject(attrs);
    cert.setIssuer(attrs);

    cert.setExtensions([
      {
        name: "basicConstraints",
        cA: true,
      },
      {
        name: "keyUsage",
        keyCertSign: true,
        cRLSign: true,
      },
    ]);

    cert.sign(keys.privateKey, forge.md.sha256.create());

    this.rootCertificate = cert;
    this.rootPrivateKey = keys.privateKey;

    await fs.writeFile(this.ROOT_CA_PATH, forge.pki.certificateToPem(cert));
    await fs.writeFile(
      this.ROOT_CA_KEY_PATH,
      forge.pki.privateKeyToPem(keys.privateKey),
    );
  }

  /**
   * Load the root CA from the file system, generating it if it does not exist
   */
  public async loadRootCA(): Promise<void> {
    logger.info("[KeyService] Loading Root CA");

    if (!(await this.rootCAExists())) {
      logger.info("[KeyService] Root CA does not exist. Generating Root CA");
      await this.generateRootCA();
      logger.info("[KeyService] Root CA generated");
    } else {
      const certificateStr = await fs.readFile(this.ROOT_CA_PATH, "utf-8");
      const privateKeyStr = await fs.readFile(this.ROOT_CA_KEY_PATH, "utf-8");

      this.rootCertificate = forge.pki.certificateFromPem(certificateStr);
      this.rootPrivateKey = forge.pki.privateKeyFromPem(privateKeyStr);
    }

    logger.info("[KeyService] Root CA loaded");
  }

  /**
   * Generates a device certificate for the specified kiosk id
   * @param kioskId The kiosk id to generate a certificate for
   * @returns The generated device certificate object
   */
  public async generateDeviceCertificate(
    kioskId: string,
  ): Promise<GeneratedDeviceCertificate> {
    const keys = forge.pki.rsa.generateKeyPair(2048);
    const cert = forge.pki.createCertificate();

    cert.publicKey = keys.publicKey;
    cert.serialNumber = "01";
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(
      cert.validity.notBefore.getFullYear() + 25,
    );

    const attrs = [
      {
        name: "commonName",
        value: "Redbox IoT Certificate",
      },
    ];

    cert.setSubject(attrs);
    cert.setIssuer(this.rootCertificate.subject.attributes);
    cert.setExtensions([
      {
        name: "keyUsage",
        digitalSignature: true,
      },
    ]);

    cert.sign(this.rootPrivateKey, forge.md.sha256.create());

    const certificateId = generateCertificateId();

    const hashService = new HashService();
    const password = await hashService.getCertificatePassword(kioskId);

    const p12Asn1 = forge.pkcs12.toPkcs12Asn1(
      keys.privateKey,
      [cert],
      password,
      {
        generateLocalKeyId: true,
        friendlyName: kioskId,
        algorithm: "3des",
      },
    );

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
    const data = {
      CertificateId: generatedCert.certificateId,
      DeviceCertPfxBase64: generatedCert.deviceClientPfx,
      RootCa: await this.getRootCA(),
    };
    const rootPath = findRoot(__dirname);
    if (!rootPath) throw new Error("Could not find root path");
    const certificatesPath = path.join(rootPath, "certificates");
    await fs.mkdir(certificatesPath, { recursive: true });
    const finalPath = path.join(
      certificatesPath,
      `${kioskId}_iotcertificatedata.json`,
    );
    await fs.writeFile(finalPath, JSON.stringify(data));
    return finalPath;
  }
}
