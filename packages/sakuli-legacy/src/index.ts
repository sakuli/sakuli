import {SakuliPresetProvider} from "@sakuli/core/dist/sakuli-preset-provider.interface";
import {SakuliPresetRegistry} from "@sakuli/core/dist/sakuli-preset-registry.class";
import {LegacyContextProvider} from "./context/legacy-context-provider";
import {Builder} from "selenium-webdriver";
import {LegacyLoader} from "./loader/legacy-loader.class";
import {migrationCommandProvider} from "./migration/migration-command-provider.function";

export {LegacyLoader, LegacyContextProvider};

const legacyPreset: SakuliPresetProvider = (reg: SakuliPresetRegistry) => {
    reg.registerContextProvider(new LegacyContextProvider(new Builder()));
    reg.registerProjectLoader(new LegacyLoader());
    reg.registerCommandModule(migrationCommandProvider)
};

export default legacyPreset;