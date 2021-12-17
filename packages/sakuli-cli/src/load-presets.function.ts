import { SakuliPresetProvider } from "@sakuli/core";
import { isPresent } from "@sakuli/commons";

const hasDefaultExport = (module: any) => {
  return module.default && typeof module.default === "function";
};

export async function loadPresets(
  presetModuleNames: string[] = []
): Promise<SakuliPresetProvider[]> {
  let potentialPresetModules: any[];

  potentialPresetModules = await Promise.all(
    presetModuleNames.map((name) =>
      import(name).then((module) => [name, module])
    )
  );
  return potentialPresetModules
    .map(([name, module]) => {
      if (hasDefaultExport(module)) {
        return module.default as SakuliPresetProvider;
      } else {
        console.warn(`${name} has no default export and is therefore ignored`);
        return null;
      }
    })
    .filter(isPresent);
}
