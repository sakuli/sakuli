import { PathLike } from "fs"
import { readJson } from "../read-json.function"
import { join } from "path";

export const getInstalledPresets = async (packageJsonPath: string): Promise<string[]> => {
    try {
        const packageJson = await readJson(join(packageJsonPath, 'package.json'));
        if("sakuli" in packageJson) {
            const sakuliConfig = packageJson.sakuli;
            if("presetProvider" in sakuliConfig && Array.isArray(sakuliConfig.presetProvider)) {
                return sakuliConfig.presetProvider;
            }
        }
        return [];
    } catch(e) {
        return [];
    }
}
