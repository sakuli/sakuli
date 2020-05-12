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
      const dependencyInfoFile = join(basePath, name, "package.json");
      if (!existsSync(dependencyInfoFile)) {
        return;
      }

      const dependency = JSON.parse(readFileSync(dependencyInfoFile, "utf-8"));
      if (isSakuliPreset(dependency) && !sakuliPresets.includes(dependency)) {
        sakuliPresets.push(dependency.name);
      }
    });
  }

  return sakuliPresets;
}
