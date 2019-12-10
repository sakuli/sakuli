import { readJson } from "../read-json.function"
import { join } from "path";

export const containsTypescript = async (packageJsonPath: string): Promise<boolean> => {
    try {
        const packageJson = await readJson(join(packageJsonPath, 'package.json'));
        if("dependencies" in packageJson) {
            return "typescript" in packageJson.dependencies
        }
        return false
    } catch(e) {
        return false
    }
};
