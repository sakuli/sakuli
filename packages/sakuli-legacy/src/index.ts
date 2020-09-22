import { SakuliPresetProvider } from "@sakuli/core/dist/sakuli-preset-provider.interface";
import { SakuliPresetRegistry } from "@sakuli/core/dist/sakuli-preset-registry.class";
import { LegacyApi, LegacyLifecycleHooks } from "./context";
import { Builder } from "selenium-webdriver";
import { LegacyLoader } from "./loader/legacy-loader.class";
import { migrationCommandProvider } from "./migration/migration-command-provider.function";
import rollupPreset from "@sakuli/rollup-hooks";
import { encryptCommand } from "./encrypt-command/encrypt-command.class";
import { createCommand } from "./command/create-command.class";
import { decryptCommand } from "./decrypt-command/decrypt-command.class";

export * from "./context";
export { LegacyLoader, LegacyApi, LegacyLifecycleHooks };

const legacyPreset: SakuliPresetProvider = (reg: SakuliPresetRegistry) => {
  reg.registerContextProvider(new LegacyLifecycleHooks(new Builder()));
  reg.registerProjectLoader(new LegacyLoader());
  reg.registerCommandModule(migrationCommandProvider);
  reg.registerCommandModule(encryptCommand);
  reg.registerCommandModule(decryptCommand);
  reg.registerCommandModule(createCommand);

  rollupPreset(reg);
};

export default legacyPreset;
