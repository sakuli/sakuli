import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { isSakuliPreset } from "./is-sakuli-preset.function";
import { isExistingDirectory } from "./is-existing-directory.function";

export function getSakuliPresets(nodeModulesPaths: string[]): string[] {
  let sakuliPresets: string[] = [];

  for (const nodeModulesPath of nodeModulesPaths) {
    const candidates: string[] = [];
    readdirSync(nodeModulesPath).forEach((name) => {
      const dir = join(nodeModulesPath, name);
      if (
        name.startsWith("@sakuli") &&
        isExistingDirectory(join(nodeModulesPath, name))
      ) {
        readdirSync(dir).forEach((n) => {
          candidates.push(join(name, n));
        });
      }
      candidates.push(name);
    });

    candidates.forEach((name) => {
      const dependencyInfoFile = join(nodeModulesPath, name, "package.json");
      if (!existsSync(dependencyInfoFile)) {
        return;
      }

      const dependency = JSON.parse(readFileSync(dependencyInfoFile, "utf-8"));
      if (
        isSakuliPreset(dependency) &&
        !sakuliPresets.includes(dependency) &&
        dependency?.name
      ) {
        sakuliPresets.push(dependency.name);
      }
    });
  }

  return sakuliPresets;
}
