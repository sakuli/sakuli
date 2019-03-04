import {SakuliPresetProvider} from "@sakuli/core";
import {SakuliPresetRegistry} from "@sakuli/core/dist/sakuli-preset-registry.class";
import {RollupLifecycleHooks} from "./rollup-lifecycle-hooks.class";

const sakuliRollupPreset: SakuliPresetProvider = (registry: SakuliPresetRegistry) => {
    registry.registerContextProvider(new RollupLifecycleHooks());
};

export default sakuliRollupPreset;