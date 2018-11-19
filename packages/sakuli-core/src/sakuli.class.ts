import { ProjectLoader } from "./loader/loader.interface";
import { SakuliRunOptions } from "./sakuli-run-options.interfac";
import { SakuliRunner } from "./runner";
import { SakuliPresetProvider } from "./sakuli-preset-provider.interface";
import { SakuliPresetRegistry } from "./sakuli-preset-registry.class";
import { Maybe, ifPresent, throwIfAbsent } from "@sakuli/commons";
import { Project } from "./loader";
import { SakuliExecutionContextProvider } from "./runner/test-execution-context/sakuli-execution-context-provider.class";

export class Sakuli {

    private presetRegistry = new SakuliPresetRegistry();

    constructor(
        readonly presetProvider: SakuliPresetProvider[] = []
    ) {
        presetProvider.forEach(provider => {
            provider(this.presetRegistry)
        })
    }

    private get loader() {
        return this.presetRegistry.projectLoaders;
    }

    private get contextProviders() {
        return [
            new SakuliExecutionContextProvider(),
            ...this.presetRegistry.contextProviders
        ];
    }

    async run(_opts: string | SakuliRunOptions) {
        const opts = typeof _opts === 'string' ? {path: _opts} : _opts;
        const projects = await Promise.all(
            this.loader.map(loader => loader.load(opts.path))
        );
        const project: Maybe<Project> = throwIfAbsent(
            projects.find(p => p != null),
            Error(`Non of the following loaders could create project from ${opts.path}`)
        )
        
        const runner = new SakuliRunner(
            this.contextProviders
        )
        
        runner.execute(project);
    }



}