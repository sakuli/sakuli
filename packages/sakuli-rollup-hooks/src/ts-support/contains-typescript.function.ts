import { readJson } from "../read-json.function"
import { join } from "path";

export const containsTypescript = async (packageJsonPath: string): Promise<boolean> => {
    try {
        const packageJson = await readJson(join(packageJsonPath, 'package.json'));
        if("dependencies" || "devDependencies" in packageJson) {
            return "typescript" in packageJson.dependencies || "typescript" in packageJson.devDependencies;
        }
    } catch(e) {
        console.debug(`Could not determine if package.json contains typescript: ${e}`);
    }
    return false;
};
