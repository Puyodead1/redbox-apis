import { Config, CertificateManager, logger } from "@redbox-apis/common";
import Aedes from "aedes";
import tls from "tls";

const config = Config.get();
const PORT = config.mqttConfig.port;
const HOST = config.mqttConfig.host;

(async () => {
  const certManager = new CertificateManager();
  const aedes = new Aedes();

  await certManager.ensureAll();

  const [cert, key, ca] = await Promise.all([
    certManager.broker.getCertificatePEM(),
    certManager.broker.getPrivateKeyPEM(),
    certManager.root.getCertificatePEM(),
  ]);

  const server = tls.createServer(
    {
      cert,
      key,
      ca,
      requestCert: true,
      rejectUnauthorized: true,
    },
    (socket: any) => {
      aedes.handle(socket);
    },
  );

  server.listen(PORT, HOST, () => {
    logger.info(`Server is listening on ${HOST}:${PORT}`);
  });

  aedes.on("publish", async (packet, client) => {
    if (!client) return; // ignore broker

    const topic = packet.topic;
    const message = packet.payload.toString();

    logger.info(
      `Message received on topic "${topic}" from client "${client.id}": ${message}`,
    );
  });
})();
