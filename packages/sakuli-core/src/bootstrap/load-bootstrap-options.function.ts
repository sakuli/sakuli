import {
  SakuliBootstrapDefaults,
  SakuliBootstrapOptions,
} from "./bootstrap-options.interface";
import { ifPresent, Maybe } from "@sakuli/commons";
import { getNodeModulesPaths } from "./get-node-modules-paths.function";
import { findSakuliPresets } from "./find-sakuli-presets.function";
import { cwd } from "process";
import { getPresetDeclarationFromFile } from "./get-preset-declaration-from-file.function";
import { join } from "path";

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
    sakuliBootstrapOptions.presetProvider = findSakuliPresets(nodeModulesPaths);

    const packageJsonPath = join(cwd(), "package.json");
    const packagePresets = await getPresetDeclarationFromFile(packageJsonPath);
    for (const packagePreset of packagePresets) {
      if (!sakuliBootstrapOptions.presetProvider.includes(packagePreset)) {
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
