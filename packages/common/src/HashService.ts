import { createHash } from "crypto";

export class HashService {
    public async getKioskPassword(kioskId: string): Promise<string> {
        let sha512 = createHash("sha512");
        const base64String = sha512.update(kioskId).digest("base64");
        const theKioskPassword = await this.getSaltOfTheKioskPassword(kioskId);

        // create new hash
        sha512 = createHash("sha512");

        return sha512.update(Buffer.from(base64String + theKioskPassword)).digest("base64");
    }

    public async getCertificatePassword(kioskId: string): Promise<string> {
        let sha512 = createHash("sha512");
        const base64String = sha512.update(kioskId).digest("base64");
        const certificatePassword = await this.getSaltOfTheCertificatePassword(kioskId);

        sha512 = createHash("sha512");
        return sha512.update(Buffer.from(base64String + certificatePassword.toString())).digest("base64");
    }

    private async getSaltOfTheCertificatePassword(kioskId: string): Promise<string> {
        let num = 0;
        const lastChar = kioskId[kioskId.length - 1];
        const doubledId = kioskId + kioskId;

        for (const char of doubledId) {
            num *= char.charCodeAt(0) * lastChar.charCodeAt(0);
        }
        return num.toString();
    }

    private async getSaltOfTheKioskPassword(kioskId: string): Promise<string> {
        let num = 0;
        for (const char of kioskId) {
            num *= char.charCodeAt(0);
        }
        return num.toString();
    }
}
