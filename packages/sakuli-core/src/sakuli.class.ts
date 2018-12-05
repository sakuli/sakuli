import { ProjectLoader } from "./loader/loader.interface";
import { SakuliRunOptions } from "./sakuli-run-options.interface";
import { SakuliRunner } from "./runner";
import { SakuliPresetProvider } from "./sakuli-preset-provider.interface";
import { SakuliPresetRegistry } from "./sakuli-preset-registry.class";
import { Maybe, ifPresent, throwIfAbsent } from "@sakuli/commons";
import { Project } from "./loader";
import { SakuliExecutionContextProvider, isSakuliExecutionContext } from "./runner/test-execution-context/sakuli-execution-context-provider.class";
import { TestExecutionContext } from "./runner/test-execution-context/test-execution-context.class";
import { inspect } from "util";
import { Forwarder } from "./forwarder/forwarder.interface";
import {CommandModule} from "yargs";

export class Sakuli {

    private presetRegistry = new SakuliPresetRegistry();

    constructor(
        readonly presetProvider: SakuliPresetProvider[] = []
    ) {
        presetProvider.forEach(provider => {
            provider(this.presetRegistry)
        })
    }

    get loader() {
        return this.presetRegistry.projectLoaders;
    }

    get forwarder() {
        return [
            ...this.presetRegistry.forwarders,
            <Forwarder>{
                forward(ctx: TestExecutionContext, p: Project) {
                    console.log(inspect(ctx));
                    return Promise.resolve();
                }
            }
        ]
    }

    get contextProviders() {
        return [
            new SakuliExecutionContextProvider(),
            ...this.presetRegistry.contextProviders
        ];
    }

    getCommandModules(): CommandModule[] {
        return this.presetRegistry.commandModules.map(cmp => cmp(this));
    }

    async run(_opts: string | SakuliRunOptions) {
        const opts = typeof _opts === 'string' ? { path: _opts } : _opts;
        const projects = await Promise.all(
            this.loader.map(loader => loader.load(opts.path))
        );
        const project: Project = throwIfAbsent(
            projects.find(p => p != null),
            Error(`Non of the following loaders could create project from ${opts.path}`)
        )
        console.log(this.contextProviders);
        const runner = new SakuliRunner(
            this.contextProviders
        )

        const ctxAfterExecution = runner.execute(project);
        if(isSakuliExecutionContext(ctxAfterExecution)) {

            this.forwarder.forEach(f => {
                f.forward(ctxAfterExecution.sakuliContext, project);
            })
        }

    }



}