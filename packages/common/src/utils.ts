import { randomBytes } from "crypto";
import { existsSync } from "fs";
import os from "os";
import { dirname, join } from "path";
import { CaCertificateConfig } from "./interfaces";

export function generateCertificateId() {
  return randomBytes(32).toString("hex");
}

export function findRoot(startDir: string = __dirname): string {
  let currentDir = startDir;

  while (currentDir !== dirname(currentDir)) {
    if (existsSync(join(currentDir, "pnpm-workspace.yaml"))) {
      return currentDir;
    }
    currentDir = dirname(currentDir);
  }

  return "";
}

export function getHostname() {
  return os.hostname();
}

export function getPathRelativeRoot(...paths: string[]): string {
  const root = findRoot();
  return join(root, ...paths);
}

export function formatCertificateSubject(config: CaCertificateConfig): string {
  const fields: Record<string, string | undefined> = {
    CN: config.common_name,
    OU: config.organizational_unit,
    O: config.organization,
    L: config.locality,
    ST: config.state,
    C: config.country,
  };

  const parts = Object.entries(fields)
    .filter(([_, value]) => value && value.trim() !== "")
    .map(([key, value]) => `${key}=${value}`);

  return parts.join(", ");
}
