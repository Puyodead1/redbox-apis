import * as x509 from "@peculiar/x509";
import { Certificate } from "./Certificate";
import { Config } from "../config";
import { formatCertificateSubject } from "../utils";

const config = Config.get();

export default class RootCertificate extends Certificate {
  validityYears = config.caConfig.rootCaConfig.validity_years;
  isCA = true;

  get subject(): string {
    return formatCertificateSubject(config.caConfig.rootCaConfig);
  }

  async getExtensions(issuer?: Certificate): Promise<x509.Extension[]> {
    const extensions: x509.Extension[] = [
      new x509.BasicConstraintsExtension(true, undefined, false),
      new x509.KeyUsagesExtension(
        x509.KeyUsageFlags.keyCertSign | x509.KeyUsageFlags.cRLSign,
        true,
      ),
    ];

    if (issuer?.cert) {
      extensions.push(
        await x509.SubjectKeyIdentifierExtension.create(issuer.cert.publicKey),
      );
    }

    return extensions;
  }
}
