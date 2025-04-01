import { Command } from "commander";
import { BaseCommand } from "../base";

export class IoTCreateCertificateCommand extends BaseCommand {
    name = "create-cert";
    description = "Generate a new device certificate";

    async action(kioskId: string): Promise<void> {
        console.log(`Generating a device certificate for kiosk '${kioskId}'`);
        const generatedCert = await this.context.keyService.generateDeviceCertificate(kioskId);
        await this.context.keyService.saveDeviceCertificate(kioskId, generatedCert);
        const path = await this.context.keyService.exportDeviceCertificate(kioskId, generatedCert);
        console.log(`Device Certificate saved to '${path}'`);
    }

    protected setup(cmd: Command): void {
        cmd.argument("<kiosk_id>", "Kiosk ID");
        super.setup(cmd);
    }
}
