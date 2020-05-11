import { promises as fs } from "fs";
import { join } from "path";

export const registerPackageTask = (
  npmPackageName: string,
  packageJsonPath: string = process.cwd()
) => async () => {
  const packageJsonFilePath = join(packageJsonPath, "package.json");
  const packageJsonFile = (await fs.readFile(packageJsonFilePath)).toString();
  const packageJson = JSON.parse(packageJsonFile);
  if (!("sakuli" in packageJson)) {
    packageJson["sakuli"] = { presetProvider: [] };
  }
  if (!("presetProvider" in packageJson.sakuli)) {
    packageJson.sakuli.presetProvider = [];
  }
  if (!Array.isArray(packageJson.sakuli.presetProvider)) {
    packageJson.sakuli.presetProvider = [packageJson.sakuli.presetProvider];
  }
  packageJson.sakuli.presetProvider.push(npmPackageName);

  await fs.writeFile(packageJsonFilePath, JSON.stringify(packageJson, null, 2));
};
