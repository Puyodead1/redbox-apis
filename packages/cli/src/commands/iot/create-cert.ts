import { logger } from "@redbox-apis/common";
import { Command } from "commander";
import { BaseCommand } from "../base";

export class IoTCreateCertificateCommand extends BaseCommand {
  name = "create-cert";
  description = "Generate a new device certificate";

  async action(kioskId: string): Promise<void> {
    logger.info(`Generating a device certificate for kiosk '${kioskId}'`);
    const generatedCert =
      await this.context.certManager.generateDeviceCertificate(kioskId);
    await this.context.certManager.saveDeviceCertificate(
      kioskId,
      generatedCert,
    );
    const path = await this.context.certManager.exportDeviceCertificate(
      kioskId,
      generatedCert,
    );
    logger.info(`Device Certificate saved to '${path}'`);
  }

  protected setup(cmd: Command): void {
    cmd.argument("<kiosk_id>", "Kiosk ID");
    super.setup(cmd);
  }
}
