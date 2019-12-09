import { readJson } from "../read-json.function"
import { join } from "path";
import { JSONSchemaForNPMPackageJsonFiles } from "@schemastore/package";

export const getInstalledPresets = async (packageJsonPath: string): Promise<string[]> => {
    const fallbackPackages = ['@sakuli/legacy'];
    try {
        const packageJson = await readJson(join(packageJsonPath, 'package.json'));
        if("sakuli" in packageJson) {
            const sakuliConfig = packageJson.sakuli;
            if("presetProvider" in sakuliConfig && Array.isArray(sakuliConfig.presetProvider)) {
                return sakuliConfig.presetProvider;
            }
        }
        return fallbackPackages;
    } catch(e) {
        return fallbackPackages;
    }
}
