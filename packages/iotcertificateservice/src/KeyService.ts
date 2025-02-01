import { HashService, logger } from "@redbox-apis/common";
import fs from "fs/promises";
import forge from "node-forge";
import { generateCertificateId } from "./utils";

export class KeyService {
    private readonly ROOT_CA_PATH = "../../RootCA.crt";
    private readonly ROOT_CA_KEY_PATH = "../../RootCA.key";

    private rootCertificate!: forge.pki.Certificate;
    private rootPrivateKey!: forge.pki.PrivateKey;

    public async rootCAExists(): Promise<boolean> {
        try {
            await fs.access(this.ROOT_CA_PATH);
            await fs.access(this.ROOT_CA_KEY_PATH);

            return true;
        } catch (error) {
            return false;
        }
    }

    public getRootCA(): string {
        return forge.pki.certificateToPem(this.rootCertificate).replace(/\n/g, "\\n");
    }

    public async generateRootCA(): Promise<void> {
        const keys = forge.pki.rsa.generateKeyPair(2048);
        const cert = forge.pki.createCertificate();

        cert.publicKey = keys.publicKey;
        cert.serialNumber = "01";
        cert.validity.notBefore = new Date();
        cert.validity.notAfter = new Date();
        cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 10);

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
        await fs.writeFile(this.ROOT_CA_KEY_PATH, forge.pki.privateKeyToPem(keys.privateKey));
    }

    public async loadRootCA(): Promise<void> {
        logger.info("Loading Root CA");

        if (!(await this.rootCAExists())) {
            logger.info("Root CA does not exist. Generating Root CA");
            await this.generateRootCA();
            logger.info("Root CA generated");
        } else {
            const certificateStr = await fs.readFile(this.ROOT_CA_PATH, "utf-8");
            const privateKeyStr = await fs.readFile(this.ROOT_CA_KEY_PATH, "utf-8");

            this.rootCertificate = forge.pki.certificateFromPem(certificateStr);
            this.rootPrivateKey = forge.pki.privateKeyFromPem(privateKeyStr);
        }

        logger.info("Root CA loaded");
    }

    public async generateDeviceCertificate(
        kioskId: string
    ): Promise<{ deviceClientPfx: string; certificateId: string; certificate: string; privateKey: string }> {
        const keys = forge.pki.rsa.generateKeyPair(2048);
        const cert = forge.pki.createCertificate();

        cert.publicKey = keys.publicKey;
        cert.serialNumber = "01";
        cert.validity.notBefore = new Date();
        cert.validity.notAfter = new Date();
        cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 25);

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

        var p12Asn1 = forge.pkcs12.toPkcs12Asn1(keys.privateKey, [cert], password, {
            generateLocalKeyId: true,
            friendlyName: kioskId,
            algorithm: "3des",
        });

        const p12Der = forge.asn1.toDer(p12Asn1).getBytes();
        const p12b64 = forge.util.encode64(p12Der);

        const asn1PK = forge.pki.privateKeyToAsn1(cert.privateKey);
        const derPK = forge.asn1.toDer(asn1PK).getBytes();
        const b64PK = forge.util.encode64(derPK);

        const ans1Crt = forge.pki.certificateToAsn1(cert);
        const derCrt = forge.asn1.toDer(ans1Crt).getBytes();
        const b64Crt = forge.util.encode64(derCrt);

        return {
            deviceClientPfx: p12b64,
            certificateId,
            certificate: b64Crt,
            privateKey: b64PK,
        };
    }
}
