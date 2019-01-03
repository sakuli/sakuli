import {SakuliRunOptions} from "./sakuli-run-options.interface";
import {SakuliRunner} from "./runner";
import {SakuliPresetProvider} from "./sakuli-preset-provider.interface";
import {SakuliPresetRegistry} from "./sakuli-preset-registry.class";
import {ifPresent, Maybe, throwIfAbsent} from "@sakuli/commons";
import {Project} from "./loader";
import {SakuliExecutionContextProvider, TestExecutionContext} from "./runner/test-execution-context";
import {CommandModule} from "yargs";
import * as winston from "winston";
import {join} from "path";
import {cwd} from "process";

let sakuliInstance: Maybe<SakuliClass>;

export function Sakuli(presetProvider: SakuliPresetProvider[] = []): SakuliInstance {
    sakuliInstance = ifPresent(sakuliInstance,
        i => i,
        () => new SakuliClass(presetProvider)
    );
    return sakuliInstance;
}

const myFormat = winston.format.printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

export class SakuliClass {

    private presetRegistry = new SakuliPresetRegistry();
    readonly testExecutionContext = new TestExecutionContext();
    readonly logger = winston.createLogger({
        format: winston.format.combine(
            winston.format.label({ label: 'right meow!' }),
            winston.format.timestamp(),
            myFormat
        ),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({filename: join(cwd(), '_logs/sakuli.log') })
        ]
    });

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
            // <Forwarder>{
            //     forward(ctx: TestExecutionContext, p: Project) {
            //         console.log(inspect(ctx.toJson(), true, null, true));
            //         return Promise.resolve();
            //     }
            // }
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

    async run(_opts: string | SakuliRunOptions) {
        const opts = typeof _opts === 'string' ? {path: _opts} : _opts;
        const projects = await Promise.all(
            this.loader.map(loader => loader.load(opts.path))
        );
        this.logger.log('hello', 'Test Message');
        this.logger.info('hello 2');
        const project: Project = throwIfAbsent(
            projects.find(p => p != null),
            Error(`Non of the following loaders could create project from ${opts.path}`)
        );

        const runner = new SakuliRunner(
            this.contextProviders,
            this.testExecutionContext
        );
        await runner.execute(project);

        await Promise.all(this.forwarder.map(f => f.forward(this.testExecutionContext, project)));
    }

}

export type SakuliInstance = SakuliClass;