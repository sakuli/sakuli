import {promises as fs} from 'fs';
import { join } from 'path';

export const registerPackageTask = (npmPackageName: string) => async () => {
    const packageJsonPath = join(process.cwd(), 'package.json');
    const packageJsonFile = (await fs.readFile(packageJsonPath)).toString();
    const packageJson = JSON.parse(packageJsonFile);
    if (!("sakuli" in packageJson)) {
        packageJson["sakuli"] = { presetProvider: [] };
    }
    if (!("presetProvider" in packageJson.sakuli)) {
        packageJson.sakuli.presetProvider = []
    }
    if (!Array.isArray(packageJson.sakuli.presetProvider)) {
        packageJson.sakuli.presetProvider = [packageJson.sakuli.presetProvider];
    }
    packageJson.sakuli.presetProvider.push(npmPackageName);

    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson));
}
