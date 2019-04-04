import './winston-workaround';
import {SakuliRunOptions} from "./sakuli-run-options.interface";
import {SakuliRunner} from "./runner";
import {SakuliPresetProvider} from "./sakuli-preset-provider.interface";
import {SakuliPresetRegistry} from "./sakuli-preset-registry.class";
import {ifPresent, Maybe, throwIfAbsent} from "@sakuli/commons";
import {Project} from "./loader";
import {SakuliExecutionContextProvider, TestExecutionContext} from "./runner/test-execution-context";
import {CommandModule} from "yargs";
import {SimpleLogger} from "@sakuli/commons";

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
    readonly logger = new SimpleLogger();
    readonly testExecutionContext = new TestExecutionContext(this.logger);

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
        ]
    }

    get contextProviders() {
        return [
            new SakuliExecutionContextProvider(),
            ...this.presetRegistry.contextProviders
        ];
    }

    get commandModules(): CommandModule[] {
        return this.presetRegistry.commandModules.map(cmp => cmp(this));
    }

    async run(_opts: string | SakuliRunOptions): Promise<TestExecutionContext> {
        const opts = typeof _opts === 'string' ? {path: _opts} : _opts;
        let project: Project = new Project(opts.path || process.cwd());

        for(let loader of this.loader) {
            project = (await loader.load(project)) || project;
        }

        const runner = new SakuliRunner(
            this.contextProviders,
            this.testExecutionContext
        );
        await runner.execute(project);

        await Promise.all(this.forwarder.map(f => f.forward(this.testExecutionContext, project)));
        return this.testExecutionContext;
    }

}

export type SakuliInstance = SakuliClass;