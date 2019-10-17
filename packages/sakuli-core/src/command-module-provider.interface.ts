import {SakuliClass} from "./sakuli.class";
import {CommandModule, Argv} from "yargs";

export type CommandModule = CommandModule;
export type Argv = Argv;
export interface CommandModuleProvider {
    (sakuli: SakuliClass): CommandModule
}
