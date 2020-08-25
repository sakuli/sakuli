import { SakuliRunOptions } from "./sakuli-run-options.interface";
import { SakuliRunner } from "./runner";
import { SakuliPresetProvider } from "./sakuli-preset-provider.interface";
import { SakuliPresetRegistry } from "./sakuli-preset-registry.class";
import {
  CliArgsSource,
  DecoratedClassDefaultsSource,
  EnvironmentSource,
  ifPresent,
  Maybe,
  SimpleLogger,
  StaticPropertySource,
} from "@sakuli/commons";
import { Project } from "./loader";
import {
  SakuliExecutionContextProvider,
  TestExecutionContext,
} from "./runner/test-execution-context";
import { CommandModule } from "yargs";
import { connectForwarderToTestExecutionContext } from "./forwarder/connect-forwarder-to-test-execution-context.function";
import { SakuliCoreProperties } from "./sakuli-core-properties.class";

let sakuliInstance: Maybe<SakuliClass>;

export function Sakuli(
  presetProvider: SakuliPresetProvider[] = []
): SakuliInstance {
  sakuliInstance = ifPresent(
    sakuliInstance,
    (i) => i,
    () => new SakuliClass(presetProvider)
  );
  return sakuliInstance;
}

export class SakuliClass {
  private presetRegistry = new SakuliPresetRegistry();
  readonly logger = new SimpleLogger();
  readonly testExecutionContext = new TestExecutionContext(this.logger);

  constructor(readonly presetProvider: SakuliPresetProvider[] = []) {
    this.presetProvider.forEach((provider) => {
      provider(this.presetRegistry);
    });
  }

  get loader() {
    return this.presetRegistry.projectLoaders;
  }

  get forwarder() {
    return [...this.presetRegistry.forwarders];
  }

  get lifecycleHooks() {
    return [
      new SakuliExecutionContextProvider(),
      ...this.presetRegistry.lifecycleHooks,
    ];
  }

  get commandModules(): CommandModule[] {
    return this.presetRegistry.commandModules.map((cmp) => cmp(this));
  }

  async initializeProject(_opts: string | SakuliRunOptions): Promise<Project> {
    const opts = typeof _opts === "string" ? { path: _opts } : _opts;
    let project: Project = new Project(opts.path || process.cwd());

    await project.installPropertySource(
      new StaticPropertySource({
        "sakuli.testsuite.folder": project.rootDir,
      })
    );
    await project.installPropertySource(
      new DecoratedClassDefaultsSource(SakuliCoreProperties)
    );

    for (let loader of this.loader) {
      project = (await loader.load(project)) || project;
    }
    await project.installPropertySource(new EnvironmentSource());
    await project.installPropertySource(new CliArgsSource(process.argv));
    return project;
  }

  async run(project: Project): Promise<TestExecutionContext> {
    this.logger.trace("Connecting forwarder to TestExecutionContext...");
    const forwarderTearDown = await Promise.all(
      this.forwarder.map((forwarder) =>
        connectForwarderToTestExecutionContext(
          forwarder,
          this.testExecutionContext,
          project
        )
      )
    );
    this.logger.trace("Forwarder connected to TestExecutionContext.");
    const runner = new SakuliRunner(
      this.lifecycleHooks,
      this.testExecutionContext
    );

    this.logger.trace("Executing project with SakuliRunner...");
    await runner.execute(project);
    this.logger.trace("Project execution with SakuliRunner completed.");

    this.logger.trace("Invoke teardown on registered forwarders...");
    await Promise.all(forwarderTearDown.map((teardown) => teardown()));
    this.logger.trace(
      "Invocation of teardown on registered forwarders completed."
    );

    return this.testExecutionContext;
  }
}

export type SakuliInstance = SakuliClass;
