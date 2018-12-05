import {join} from "path";
import {SakuliBootstrapOptions} from "./bootstrap-options.interface";
import {readJsonSync} from "fs-extra";
import {ifPresent, Maybe} from "@sakuli/commons";
import {inspect} from "util";

/**
 * Reads sakuli bootconfiguration from a json file. The configuration is considered under a sakuli wich must implement the {@see SakuliBootstrapOptions} interface.*
 *
 * Per default it assumes the package.json in the current directory
 *
 * If no there is neither a readable file nor the corresponding key in the file the function will return an empty default config.
 *
 * @param path the path to the file
 * @param file the actual filename if not <code>package.json</code>
 */
export async function loadBootstrapOptions(path: string = '.', file: string = 'package.json'): Promise<SakuliBootstrapOptions> {
    let conf: Maybe<SakuliBootstrapOptions>;

    try {
        const packageJson = await readJsonSync(join(path, file)) as any;
        if (packageJson && packageJson.sakuli) {
            conf = packageJson.sakuli
        }
    } catch (e) {

    }
    return ifPresent(conf,
        c => c,
        () => ({
            presetProvider: []
        })
        )
}