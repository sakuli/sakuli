#!/usr/bin/env node

import * as figlet from "figlet";

declare function require(id: string): any;

require('yargonaut')
    .helpStyle('green')
    .errorsStyle('red.bold');

import {bootstrap, loadBootstrapOptions} from "@sakuli/core";
import * as yargs from 'yargs';
import chalk from 'chalk';
import {runCommand} from './run-command.function';

import {loadPresets} from "./load-presets.function";
import {cwd} from "process";
import {cli} from "./cli-utils/command-line.class";

(async () => {

    const options = await loadBootstrapOptions(cwd());
    const sakuli = await bootstrap(options, loadPresets);
    cli()
        .savePosition()
        .write(chalk`{yellow ${figlet.textSync(`Sakuli`, {
            horizontalLayout: "full"
        })}}`)
        .newLine()
        .write(chalk`{gray ========================================}`)
        .newLine()
        .newLine();

    const yargsParser = yargs
        .scriptName('sakuli')
        .usage(chalk`Usage: {bold $0} {bold.green COMMAND} {green [ARGUMENT]} {gray [OPTIONS]}`)
        .command(runCommand(sakuli))
        .option('loop', {
            describe: 'Loop this suite, wait n seconds between executions, 0 mean no loops (default)',
            default: 0,
            type: 'number'
        })
        .option('preHook', {
            describe: `Program which will be executed before a suite run (can be added multiple times)`,
            type: "array"
        })
        .option('postHook', {
            describe: `Program which will be executed after a suite run (can be added multiple times)`,
            type: "array"
        })
        .option('masterkey', {
            describe: `Masterkey used to decrypt secrets during runtime`,
            type: "string"
        })
        .demandCommand(1, 1, 'Sakuli expects exactly one command');

    sakuli.commandModules.forEach(cmp => {
        yargsParser.command(cmp)
    });

    yargsParser.parse();
})();