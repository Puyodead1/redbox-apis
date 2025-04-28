import TOML from "@iarna/toml";
import fs from "fs";
import path from "path";
import { AppConfig, AppConfigSchema } from "./interfaces";

export class Config {
    private static instance: AppConfig;

    static load() {
        if (this.instance) {
            return;
        }

        const configPath = path.join(__dirname, "..", "..", "..", "config.toml");
        const absolutePath = path.resolve(configPath);

        if (!fs.existsSync(absolutePath)) {
            throw new Error(`Config file not found at ${absolutePath}`);
        }

        const fileContent = fs.readFileSync(absolutePath, "utf8");
        const parsed = TOML.parse(fileContent);

        const result = AppConfigSchema.safeParse(parsed);

        if (!result.success) {
            console.error("Config validation error:", result.error.format());
            throw new Error("Invalid configuration file.");
        }

        this.instance = result.data;
    }

    static get(): AppConfig {
        if (!this.instance) {
            // throw new Error("Config not loaded. Call Config.load() first.");
            Config.load();
        }
        return this.instance;
    }
}
