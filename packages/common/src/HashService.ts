import { createHash } from "crypto";

export class HashService {
    /**
     * Calculates a kiosk password from the kiosk id
     * @param kioskId The kiosk id
     * @returns The kiosk password
     */
    public async getKioskPassword(kioskId: string): Promise<string> {
        let sha512 = createHash("sha512");
        const base64String = sha512.update(kioskId).digest("base64");
        const theKioskPassword = await this.getSaltOfTheKioskPassword(kioskId);

        // create new hash
        sha512 = createHash("sha512");

        return sha512.update(Buffer.from(base64String + theKioskPassword)).digest("base64");
    }

    /**
     * Calculates a certificate password from the kiosk id
     * @param kioskId The kiosk id
     * @returns
     */
    public async getCertificatePassword(kioskId: string): Promise<string> {
        let sha512 = createHash("sha512");
        const base64String = sha512.update(kioskId).digest("base64");
        // redbox devs didn't realize the salt generation function result wasnt used because they never awaited it lmfao
        const certificatePassword = "System.Threading.Tasks.Task`1[System.String]";

        sha512 = createHash("sha512");
        return sha512.update(Buffer.from(base64String + certificatePassword.toString())).digest("base64");
    }

    /**
     * Calculates the salt for a kiosk id
     * @param kioskId The kiosk id
     * @returns The salt
     */
    private async getSaltOfTheKioskPassword(kioskId: string): Promise<string> {
        let num = 0;
        for (const char of kioskId) {
            num *= char.charCodeAt(0);
        }
        return num.toString();
    }
}
