import {Argv, CommandModule} from "yargs";
import {CommandModuleProvider, Sakuli, SakuliInstance, SakuliRunOptions, TestExecutionContext} from "@sakuli/core";
import {cli} from "./cli-utils/command-line.class";
import {stripIndents} from "common-tags";
import {renderArray} from "./render/render-array.function";
import {renderTestEntity} from "./render/render-test-entity.function";
import {EOL} from "os";

export const runCommand: CommandModuleProvider = (sakuli: SakuliInstance): CommandModule => {
    return ({
        command: 'run [path]',
        describe: 'Runs a Sakuli Suite',
        builder(argv: Argv) {
            return argv.positional('path', {
                describe: 'path to Sakuli suite'
            }).demandOption('path');
        },
        async handler(runOptions: SakuliRunOptions) {
            let tick = 0;

            function updateView(tec: TestExecutionContext) {
                cli().clearToBeginn().setPosition(0, 0)
                    .write(stripIndents`
                        Sakuli execution started at ${tec.startDate}
                    ` + EOL + renderArray(tec.testSuites, ts => renderTestEntity(ts, tick))
                    );
            }

            Sakuli().testExecutionContext.onChange(updateView);
            const interval = setInterval(() => {
                updateView(Sakuli().testExecutionContext);
                tick++
            }, 250);
            await sakuli.run(runOptions);
            clearInterval(interval);
        }
    })
};