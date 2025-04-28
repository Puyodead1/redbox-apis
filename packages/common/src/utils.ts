import { randomBytes } from "crypto";
import { existsSync } from "fs";
import os from "os";
import { dirname, join } from "path";

export function generateCertificateId() {
  return randomBytes(32).toString("hex");
}

export function findRoot(startDir: string = __dirname): string | null {
  let currentDir = startDir;

  while (currentDir !== dirname(currentDir)) {
    if (existsSync(join(currentDir, "pnpm-workspace.yaml"))) {
      return currentDir;
    }
    currentDir = dirname(currentDir);
  }

  return null;
}

export function getHostname() {
  return os.hostname();
}
