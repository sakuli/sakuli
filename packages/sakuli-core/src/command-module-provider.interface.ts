import {SakuliClass} from "./sakuli.class";
import {CommandModule} from "yargs";

export interface CommandModuleProvider {
    (sakuli: SakuliClass): CommandModule
}