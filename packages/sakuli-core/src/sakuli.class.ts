import {SakuliRunOptions} from "./sakuli-run-options.interface";
import {SakuliRunner} from "./runner";
import {SakuliPresetProvider} from "./sakuli-preset-provider.interface";
import {SakuliPresetRegistry} from "./sakuli-preset-registry.class";
import {ifPresent, Maybe, throwIfAbsent} from "@sakuli/commons";
import {Project} from "./loader";
import {SakuliExecutionContextProvider, TestExecutionContext} from "./runner/test-execution-context";
import {inspect} from "util";
import {Forwarder} from "./forwarder";
import {CommandModule} from "yargs";

let sakuliInstance: Maybe<SakuliClass>;

export function Sakuli(presetProvider: SakuliPresetProvider[] = []): SakuliInstance {
    sakuliInstance = ifPresent(sakuliInstance,
        i => i,
        () => new SakuliClass(presetProvider)
    );
    return sakuliInstance;
}

export class SakuliClass {

    private presetRegistry = new SakuliPresetRegistry();
    readonly testExecutionContext = new TestExecutionContext();

    constructor(
        readonly presetProvider: SakuliPresetProvider[] = []
    ) {
        this.presetProvider.forEach(provider => {
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
                    console.log(inspect(ctx.toJson(), true, null, true));
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
        const opts = typeof _opts === 'string' ? {path: _opts} : _opts;
        const projects = await Promise.all(
            this.loader.map(loader => loader.load(opts.path))
        );
        const project: Project = throwIfAbsent(
            projects.find(p => p != null),
            Error(`Non of the following loaders could create project from ${opts.path}`)
        );

        const runner = new SakuliRunner(
            this.contextProviders
        );
        await runner.execute(project);

        await Promise.all(this.forwarder.map(f => f.forward(this.testExecutionContext, project)));
    }

}

export type SakuliInstance = SakuliClass;