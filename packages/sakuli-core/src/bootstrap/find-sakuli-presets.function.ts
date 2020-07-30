import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { isSakuliPreset } from "./is-sakuli-preset.function";
import { isExistingDirectory } from "./is-existing-directory.function";

export function findSakuliPresets(nodeModulesPaths: string[]): string[] {
  let sakuliPresets: string[] = [];

  for (const nodeModulesPath of nodeModulesPaths) {
    const sakuliOrgPackages = getSakuliOrgPackages(nodeModulesPath);
    const foundSakuliPresets = getSakuliPresetsFromPackages(sakuliOrgPackages);
    sakuliPresets.push(
      ...foundSakuliPresets.filter(
        (foundSakuliPreset) => !sakuliPresets.includes(foundSakuliPreset)
      )
    );
  }

  sakuliPresets.length
    ? console.debug(
        `Sakuli presets found during auto discovery: ${sakuliPresets}`
      )
    : console.debug("No Sakuli presets found during auto discovery");
  return sakuliPresets;
}

function getSakuliOrgPackages(nodeModulesPath: string) {
  const sakuliOrgDir = join(nodeModulesPath, "@sakuli");
  if (isExistingDirectory(sakuliOrgDir)) {
    return readdirSync(sakuliOrgDir)
      .map((sakuliOrgPackage) => join(sakuliOrgDir, sakuliOrgPackage))
      .filter(isExistingDirectory);
  }
  return [];
}

function getSakuliPresetsFromPackages(sakuliOrgPackages: string[]) {
  return sakuliOrgPackages
    .map((name) => join(name, "package.json"))
    .filter(existsSync)
    .map((packageJsonFile) =>
      JSON.parse(readFileSync(packageJsonFile, "utf-8"))
    )
    .filter(isSakuliPreset)
    .filter((packageJson) => packageJson?.name)
    .map((packageJson) => <string>packageJson.name);
}
