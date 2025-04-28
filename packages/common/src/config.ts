import TOML from "@iarna/toml";
import fs from "fs";
import path from "path";
import { AppConfig } from "./interfaces";
import { AppConfigSchema } from "./schemas/common";

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

    const { error, value } = AppConfigSchema.validate(parsed);

    if (error) {
      console.error("Config validation error:", error);
      throw new Error("Invalid configuration file.");
    }

    this.instance = value;
  }

  static get(): AppConfig {
    if (!this.instance) {
      // throw new Error("Config not loaded. Call Config.load() first.");
      Config.load();
    }
    return this.instance;
  }
}
