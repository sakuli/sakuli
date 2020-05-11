import { SakuliBootstrapDefaults, SakuliBootstrapOptions, } from "./bootstrap-options.interface";
import { ifPresent, Maybe } from "@sakuli/commons";
import { promises as fs } from "fs";
import { join } from "path";

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
export async function loadBootstrapOptions(
  path: string = ".",
  file: string = "package.json"
): Promise<SakuliBootstrapOptions> {
  let conf: Maybe<SakuliBootstrapOptions>;

  try {
    //const packageJson = await readJsonSync(join(path, file)) as any;
    const packageJsonContent = await fs.readFile(join(path, file));
    const packageJson = JSON.parse(packageJsonContent.toString());

    if (packageJson && packageJson.sakuli) {
      conf = packageJson.sakuli;
    }
  } catch (e) {}

  return ifPresent(
    conf,
    (c) => c,
    () => SakuliBootstrapDefaults
  );
}
