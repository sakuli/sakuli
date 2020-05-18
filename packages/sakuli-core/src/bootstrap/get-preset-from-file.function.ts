import { promises as fs } from "fs";
import { join } from "path";

export async function getPresetFromFile(
  path: string = ".",
  file: string = "package.json"
): Promise<string[]> {
  try {
    const packageJsonContent = await fs.readFile(join(path, file));
    const packageJson = JSON.parse(packageJsonContent.toString());

    if (packageJson && packageJson.sakuli) {
      return packageJson.sakuli.presetProvider;
    }
  } catch (e) {}

  return [];
}
