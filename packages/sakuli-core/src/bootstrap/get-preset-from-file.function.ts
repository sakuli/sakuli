import { promises as fs } from "fs";
import { join } from "path";

export async function getPresetFromFile(
  path: string = ".",
  file: string = "package.json"
): Promise<string[]> {
  const packageJsonPath = join(path, file);
  try {
    const packageJsonContent = await fs.readFile(packageJsonPath);
    const packageJson = JSON.parse(packageJsonContent.toString());

    if (packageJson?.sakuli?.presetProvider) {
      return packageJson.sakuli.presetProvider;
    }
  } catch (e) {
    console.warn(
      `Could not get preset information from '${packageJsonPath}', because: ${e}`
    );
  }

  return [];
}
