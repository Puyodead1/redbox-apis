import { Config, KeyService, logger } from "@redbox-apis/common";
import Aedes from "aedes";
import fs from "fs";
import tls from "tls";

const config = Config.get();
const PORT = config.mqttConfig.port;
const HOST = config.mqttConfig.host;
const CERT_PATH = "../../mqtt.crt";
const KEY_PATH = "../../mqtt.key";

(async () => {
  const keyService = new KeyService();
  const aedes = new Aedes();

  // await keyService.loadRootCA();
  // const keyPair = await keyService.loadKeyPair(
  //   "MQTT Broker",
  //   CERT_PATH,
  //   KEY_PATH,
  //   true,
  //   "Redbox API MQTT Broker",
  // );

  const server = tls.createServer(
    {
      key: fs.readFileSync(KEY_PATH),
      cert: fs.readFileSync("../../fullchain.crt"),
      ca: [fs.readFileSync("../../RootCA.crt")],
      requestCert: true,
      rejectUnauthorized: false,
      honorCipherOrder: true,
    },
    (socket: any) => {
      console.log("TLS connection from", socket.remoteAddress);
      if (socket.authorized) {
        console.log("✅ Client cert verified");
      } else {
        console.warn("⚠️ Client not authorized:", socket.authorizationError);
      }
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
