import {SakuliBootstrapOptions} from "./bootstrap-options.interface";
import {Sakuli} from "../sakuli.class";
import {SakuliPresetProvider} from "../sakuli-preset-provider.interface";


export async function bootstrap(bootstrapOptions: SakuliBootstrapOptions, resolvePresetFn: (presetModuleNames: string[]) => Promise<SakuliPresetProvider[]>) {
    const presetProviders = await resolvePresetFn(bootstrapOptions.presetProvider);
    const sakuli = new Sakuli(presetProviders);
    return sakuli;
}