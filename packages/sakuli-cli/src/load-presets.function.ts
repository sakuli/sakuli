import { PluginValidator } from "@sakuli/plugin-validator";
import { SakuliPresetProvider } from "@sakuli/core";
import { isPresent } from "@sakuli/commons";
import chalk from "chalk";

export const LICENSE_KEY = "SAKULI_LICENSE_KEY";

const hasDefaultExport = (module: any) => {
  return module.default && typeof module.default === "function";
};

const getUserToken = () => {
  return process.env[LICENSE_KEY] || "";
};

export async function loadPresets(
  presetModuleNames: string[] = []
): Promise<SakuliPresetProvider[]> {
  let potentialPresetModules: any[];
  try {
    potentialPresetModules = await Promise.all(
      presetModuleNames.map((name) =>
        import(name).then((module) => [name, module])
      )
    );
  } catch (e) {
    throw e;
  }
  return potentialPresetModules
    .map(([name, module]) => {
      if (hasDefaultExport(module)) {
        const validator = new PluginValidator(name);
        try {
          validator.verifyPlugin(module, getUserToken());
        } catch (e) {
          console.warn(
            chalk`{red Failed to enable plugin ${name}. Reason: ${e}}`
          );
          return null;
        }
        return module.default as SakuliPresetProvider;
      } else {
        console.warn(`${name} has no default export and is therefore ignored`);
        return null;
      }
    })
    .filter(isPresent);
}
