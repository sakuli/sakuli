import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { isSakuliPreset } from "./is-sakuli-preset.function";

export function getSakuliPresets(nodeModulesPaths: string[]): string[] {
  let sakuliPresets: string[] = [];

  for (const basePath of nodeModulesPaths) {
    const candidates: string[] = [];
    readdirSync(basePath).forEach((name) => {
      candidates.push(name);
    });
    candidates.forEach((name) => {
      const infoFile = join(basePath, name, "package.json");
      if (!existsSync(infoFile)) {
        return;
      }

      const info = JSON.parse(readFileSync(infoFile, "utf-8"));
      if (isSakuliPreset(info) && !sakuliPresets.includes(info)) {
        sakuliPresets.push(info.name);
      }
    });
  }

  return sakuliPresets;
}
