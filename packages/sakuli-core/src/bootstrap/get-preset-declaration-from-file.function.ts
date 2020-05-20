import { promises as fs } from "fs";

export async function getPresetDeclarationFromFile(
  packageJsonPath: string
): Promise<string[]> {
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
