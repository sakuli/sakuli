import {SakuliPresetProvider} from "@sakuli/core";
import {SakuliPresetRegistry} from "@sakuli/core/dist/sakuli-preset-registry.class";
import {RollupLifecycleHooks} from "./rollup-lifecycle-hooks.class";
import {enableTypescriptCommand} from './enable-typescript-command.class'

const sakuliRollupPreset: SakuliPresetProvider = (registry: SakuliPresetRegistry) => {
    registry.registerContextProvider(new RollupLifecycleHooks());
    registry.registerCommandModule(enableTypescriptCommand)
};

export default sakuliRollupPreset;
