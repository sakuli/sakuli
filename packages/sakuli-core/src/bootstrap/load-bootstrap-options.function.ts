import {
  SakuliBootstrapDefaults,
  SakuliBootstrapOptions,
} from "./bootstrap-options.interface";
import { ifPresent, Maybe } from "@sakuli/commons";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join, resolve } from "path";
import { isSakuliPreset } from "./is-sakuli-preset.function";
import { cwd } from "process";
import execa from "execa";

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
  let sakuliAutoDiscovery: SakuliBootstrapOptions = { presetProvider: [] };
  let path = cwd();

  try {
    let previous: string;
    let nodeModulesPaths: string[] = [];
    do {
      const modules = join(path, "node_modules/@sakuli");
      if (existsSync(modules) && statSync(modules).isDirectory()) {
        nodeModulesPaths.push(modules);
      }

      previous = path;
      path = resolve(join(previous, ".."));
    } while (previous !== path);

    let { stdout } = await execa("npm", ["root", "-g"]);
    if (existsSync(modules) && statSync(modules).isDirectory()) {
      nodeModulesPaths.push(`${stdout}/@sakuli`);
    }

    for (const basePath of nodeModulesPaths) {
      const candidates: string[] = [];
      readdirSync(basePath).forEach((name) => {
        candidates.push(name);
      });
      candidates.forEach((name) => {
        const infoFile = join(basePath, name, "package.json");
        if (!existsSync(infoFile)) {
          return;
        }

        const info = JSON.parse(readFileSync(infoFile, "utf-8"));
        if (
          isSakuliPreset(info) &&
          !sakuliAutoDiscovery.presetProvider.includes(info)
        ) {
          sakuliAutoDiscovery.presetProvider.push(info.name);
        }
      });
    }
    conf = sakuliAutoDiscovery;
  } catch (e) {}

  return ifPresent(
    conf,
    (c) => c,
    () => SakuliBootstrapDefaults
  );
}
