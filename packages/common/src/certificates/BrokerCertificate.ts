import * as x509 from "@peculiar/x509";
import { Certificate } from "./Certificate";
import { Config } from "../config";
import { formatCertificateSubject } from "../utils";

const config = Config.get();

export default class BrokerCertificate extends Certificate {
  validityYears = config.caConfig.brokerConfig.validity_years;
  isCA = false;

  get subject(): string {
    return formatCertificateSubject(config.caConfig.brokerConfig);
  }

  async getExtensions(issuer?: Certificate): Promise<x509.Extension[]> {
    const extensions: x509.Extension[] = [
      new x509.BasicConstraintsExtension(false, undefined, false),
      new x509.KeyUsagesExtension(
        x509.KeyUsageFlags.digitalSignature |
          x509.KeyUsageFlags.keyEncipherment,
        false,
      ),
      new x509.ExtendedKeyUsageExtension([x509.ExtendedKeyUsage.serverAuth]),
      new x509.SubjectAlternativeNameExtension(
        config.caConfig.brokerConfig.alternative_names,
      ),
      new x509.CRLDistributionPointsExtension(
        config.caConfig.brokerConfig.crl_distribution_points || [],
      ),
    ];

    if (issuer?.cert) {
      const certId: x509.CertificateIdentifier = {
        name: [],
        serialNumber: issuer.cert.serialNumber,
      };
      extensions.push(
        await x509.AuthorityKeyIdentifierExtension.create(certId),
      );
    }

    return extensions;
  }
}
