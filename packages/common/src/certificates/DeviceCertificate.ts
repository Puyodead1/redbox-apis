import * as x509 from "@peculiar/x509";
import { Certificate } from "./Certificate";
import { Config } from "../config";
import { formatCertificateSubject } from "../utils";

const config = Config.get();

export default class DeviceCertificate extends Certificate {
  validityYears = config.caConfig.deviceConfig.validity_years;
  isCA = false;

  constructor(certPath: string, keyPath: string, private kioskId?: string) {
    super(certPath, keyPath);
  }

  get subject(): string {
    return formatCertificateSubject(config.caConfig.deviceConfig);
  }

  async getExtensions(issuer?: Certificate): Promise<x509.Extension[]> {
    const extensions: x509.Extension[] = [
      new x509.BasicConstraintsExtension(false, undefined, false),
      new x509.KeyUsagesExtension(x509.KeyUsageFlags.digitalSignature, true),
    ];

    if (issuer?.cert) {
      const certId: x509.CertificateIdentifier = {
        name: [],
        serialNumber: issuer.cert.serialNumber,
      };
      extensions.push(
        await x509.AuthorityKeyIdentifierExtension.create(certId),
      );

      extensions.push(
        await x509.SubjectKeyIdentifierExtension.create(issuer.cert.publicKey),
      );
    }

    return extensions;
  }
}
