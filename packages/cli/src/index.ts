import { KeyService } from "@redbox-apis/common";
import { program } from "commander";
import { loadCommands } from "./commands";
import Context from "./context";

(async () => {
  program
    .name("Redbox API CLI")
    .description("Management CLI for Redbox API")
    .version("1.0.0");

  const keyService = new KeyService();
  await keyService.loadRootCA();

  const context = new Context(keyService);
  console.debug("[Context] Initialized");
  console.debug("[Commands] Loading...");
  const commands = loadCommands(context);
  console.debug(`[Commands] Loaded ${commands.length} commands`);
  commands.forEach((cmd) => program.addCommand(cmd));

  program.parse(process.argv);
})();
