import {
  SakuliBootstrapDefaults,
  SakuliBootstrapOptions,
} from "./bootstrap-options.interface";
import { ifPresent, Maybe } from "@sakuli/commons";
import { getNodeModulesPaths } from "./get-node-modules-paths.function";
import { getSakuliPresets } from "./get-sakuli-presets.function";
import { cwd } from "process";
import { getPresetFromFile } from "./get-preset-from-file.function";

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

  try {
    let sakuliBootstrapOptions: SakuliBootstrapOptions = { presetProvider: [] };

    const nodeModulesPaths = await getNodeModulesPaths();
    sakuliBootstrapOptions.presetProvider = getSakuliPresets(nodeModulesPaths);

    const path = cwd();
    const packagePresets = await getPresetFromFile(path, "package.json");
    for (const packagePreset of packagePresets) {
      if (sakuliBootstrapOptions.presetProvider.indexOf(packagePreset) < 0) {
        sakuliBootstrapOptions.presetProvider.push(packagePreset);
      }
    }

    conf = sakuliBootstrapOptions;
  } catch (e) {}

  return ifPresent(
    conf,
    (c) => c,
    () => SakuliBootstrapDefaults
  );
}
