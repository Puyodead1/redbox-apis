import { CertificateManager } from "@redbox-apis/common";

export default class Context {
  constructor(public readonly certManager: CertificateManager) {}
}
