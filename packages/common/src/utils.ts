import { randomBytes } from "crypto";

export function generateCertificateId() {
    return randomBytes(32).toString("hex");
}
