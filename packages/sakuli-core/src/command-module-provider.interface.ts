import { SakuliClass } from "./sakuli.class";
import { Argv as YargsArgv, CommandModule as YargsCommandModule } from "yargs";

export type CommandModule = YargsCommandModule;
export type Argv = YargsArgv;
export interface CommandModuleProvider {
  (sakuli: SakuliClass): CommandModule;
}
