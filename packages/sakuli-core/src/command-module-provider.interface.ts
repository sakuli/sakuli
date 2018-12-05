import {Sakuli} from "./sakuli.class";
import {CommandModule} from "yargs";

export interface CommandModuleProvider {
    (sakuli: Sakuli): CommandModule
}