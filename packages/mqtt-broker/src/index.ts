import { CertificateManager, Config, logger } from "@redbox-apis/common";
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

  aedes.on("client", (client) => {
    logger.info(`Client connected: ${client.id}`);
  });

  aedes.on("clientDisconnect", (client) => {
    logger.info(`Client disconnected: ${client.id}`);
  });

  aedes.on("clientError", (client, err) => {
    logger.error(`Client error on ${client.id}: ${err.message}`);
  });

  aedes.on("clientReady", (client) => {
    logger.info(`Client ready: ${client.id}`);
  });

  aedes.on("subscribe", (subscriptions, client) => {
    const topics = subscriptions.map((sub) => sub.topic).join(", ");
    logger.info(`Client "${client.id}" subscribed to topics: ${topics}`);
  });

  aedes.on("unsubscribe", (subscriptions, client) => {
    const topics = subscriptions.join(", ");
    logger.info(`Client "${client.id}" unsubscribed from topics: ${topics}`);
  });

  aedes.on("ping", (packet, client) => {
    logger.info(`Ping received from client "${client.id}"`);
  });

  aedes.on("ack", (packet, client) => {
    logger.info(
      `ACK received from client "${client.id}" for packet ID: ${packet.messageId}`,
    );
  });

  aedes.on("closed", () => {
    logger.info("Aedes broker closed");
  });

  aedes.on("connackSent", (packet, client) => {
    logger.info(`CONNACK sent to client "${client.id}"`);
  });

  aedes.on("connectionError", (client, err) => {
    logger.error(
      `Connection error on client "${client ? client.id : "unknown"}": ${
        err.message
      }`,
    );
  });

  aedes.on("keepaliveTimeout", (client) => {
    logger.warn(`Keepalive timeout for client "${client.id}"`);
  });

  aedes.on("publish", async (packet, client) => {
    if (!client) return; // ignore broker
    logger.debug(packet);

    const topic = packet.topic;
    const message = packet.payload.toString();

    logger.info(
      `Message received on topic "${topic}" from client "${client.id}": ${message}`,
    );

    // TODO: publish response
  });
})();
