import {SakuliClass} from "./sakuli.class";
import {CommandModule as YargsCommandModule, Argv as YargsArgv} from "yargs";

export type CommandModule = YargsCommandModule;
export type Argv = YargsArgv;
export interface CommandModuleProvider {
    (sakuli: SakuliClass): CommandModule
}
