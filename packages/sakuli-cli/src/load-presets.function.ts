import {SakuliPresetProvider} from "@sakuli/core";
import {isPresent} from "@sakuli/commons";

export async function loadPresets(presetModuleNames: string[] = []): Promise<SakuliPresetProvider[]> {
    let potentialPresetModules: any[];
    try {
        potentialPresetModules = await Promise.all(presetModuleNames
            .map(name => import(name).then(module => [name, module]))
        );
    } catch (e) {
        throw e;
    }
    return potentialPresetModules.map(([name, module]) => {
        if (module.default && typeof module.default === 'function') {
            return module.default as SakuliPresetProvider
        } else {
            console.warn(`${name} has no default export and is therefore ignored`);
            return null;
        }
    }).filter(isPresent);
}