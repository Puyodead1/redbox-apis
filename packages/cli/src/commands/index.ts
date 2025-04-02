import { Command } from "commander";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import Context from "../context";

export function loadCommands(context: Context): Command[] {
    const commands: Command[] = [];
    const basePath = __dirname;

    function loadCommandFiles(dir: string) {
        const files = readdirSync(dir, { withFileTypes: true });

        for (const file of files) {
            const fullPath = join(dir, file.name);

            if (file.isDirectory()) {
                loadCommandFiles(fullPath);
            } else if (file.name.endsWith(".ts") || file.name.endsWith(".js")) {
                if (file.name.startsWith("base") || file.name.startsWith("index")) {
                    continue;
                }
                const module = require(fullPath);

                for (const key in module) {
                    if (typeof module[key] === "function") {
                        const instance = new module[key]();
                        if (instance.createCommand) {
                            commands.push(instance.createCommand(context));
                        }
                    }
                }
            }
        }
    }

    loadCommandFiles(basePath);
    return commands;
}
