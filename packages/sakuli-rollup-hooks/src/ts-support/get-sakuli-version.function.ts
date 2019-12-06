import { join } from "path";
import { readJson } from "../read-json.function";
import { JSONSchemaForNPMPackageJsonFiles, Dependency } from "@schemastore/package";
import execa = require("execa");
import { ifPresent, throwIfAbsent, SimpleLogger } from "@sakuli/commons";

export const getSakuliVersion = async (packageJsonPath: string) => {
    try {
        const packageJson: JSONSchemaForNPMPackageJsonFiles = await readJson(join(packageJsonPath, 'package.json'));
        const getDep = (deps: Dependency) => throwIfAbsent(deps['@sakuli/cli']);
        return ifPresent(packageJson.dependencies, getDep,
            () => {
                const devDep = throwIfAbsent(packageJson.devDependencies);
                return getDep(devDep);
            });
    } catch (e) {
        console.debug(`enable-typescript could not determine version from ${join(packageJsonPath, 'package.json')}`)
    } // want to avoid nested try/catch ;)

    try {
        const commandResult = await execa('npx', ['sakuli', '--version'], { cwd: packageJsonPath })
        return commandResult.stdout;
    } catch (e) {
        console.debug(`enable-typescript could not determine version from running 'npx sakuli --version'`)
    }

    return 'latest';
}
