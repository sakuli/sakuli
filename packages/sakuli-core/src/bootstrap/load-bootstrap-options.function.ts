import {
  SakuliBootstrapDefaults,
  SakuliBootstrapOptions,
} from "./bootstrap-options.interface";
import { ifPresent, Maybe } from "@sakuli/commons";
import { cwd } from "process";
import { getNodeModulesPaths } from "./get-node-modules-paths.function";
import { getSakuliPresets } from "./get-sakuli-presets.function";

/**
 * Reads sakuli bootconfiguration from a json file. The configuration is considered under a sakuli wich must implement the {@see SakuliBootstrapOptions} interface.*
 *
 * Per default it assumes the package.json in the current directory
 *
 * If no there is neither a readable file nor the corresponding key in the file the function will return an empty default config.
 *
 */
export async function loadBootstrapOptions(): Promise<SakuliBootstrapOptions> {
  let conf: Maybe<SakuliBootstrapOptions>;
  let path = cwd();

  try {
    let sakuliAutoDiscovery: SakuliBootstrapOptions = { presetProvider: [] };

    const nodeModulesPaths = await getNodeModulesPaths(path);
    sakuliAutoDiscovery.presetProvider = getSakuliPresets(nodeModulesPaths);
    conf = sakuliAutoDiscovery;
  } catch (e) {}

  return ifPresent(
    conf,
    (c) => c,
    () => SakuliBootstrapDefaults
  );
}
