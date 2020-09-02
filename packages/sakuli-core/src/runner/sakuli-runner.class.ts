import { Project, TestFile } from "../loader/model";
import { TestExecutionLifecycleHooks } from "./context-provider.interface";
import { TestScriptExecutor } from "./test-script-executor.interface";
import { readFile } from "fs";
import { JsScriptExecutor } from "./js-script-executor.class";
import { join, resolve } from "path";
import { TestExecutionContext } from "./test-execution-context";
import Signals = NodeJS.Signals;
import { nodeSignals } from "../node-signals";

export class SakuliRunner implements TestExecutionLifecycleHooks {
  constructor(
    readonly lifecycleHooks: TestExecutionLifecycleHooks[],
    readonly testExecutionContext: TestExecutionContext,
    readonly testFileExecutor: TestScriptExecutor = new JsScriptExecutor()
  ) {}

  /**
   * Tears up all lifecycle-hooks, merges their results of getContext and pass this result to the testFile Executor
   * Tears down all service providers after execution of each testFile
   *
   * @param project The Project Structure found by a Project loader
   * @returns a merged object from all provided contexts after their execution
   */
  async execute(project: Project): Promise<any> {
    await this.registerSignalHandler(project);
    this.registerUnhandledErrorNotifier(project);

    this.testExecutionContext.startExecution();

    // onProject Phase
    await this.onProject(project, this.testExecutionContext);
    let result = {};
    await this.beforeExecution(project, this.testExecutionContext);
    for (const testFile of project.testFiles) {
      try {
        const testFileContent = await this.readFileContent(
          testFile,
          project,
          this.testExecutionContext
        );
        await this.beforeRunFile(testFile, project, this.testExecutionContext);
        const context = await this.requestContext(
          this.testExecutionContext,
          project
        );
        const resultCtx = await this.testFileExecutor.execute(
          testFileContent.toString(),
          context,
          {
            filename: resolve(join(project.rootDir, testFile.path)),
            waitUntilDone: true,
            breakOnSigint: true,
          }
        );
        await this.afterRunFile(testFile, project, this.testExecutionContext);
        result = { ...result, ...resultCtx };
      } catch (error) {
        if (this.testExecutionContext.getCurrentTestSuite()) {
          this.testExecutionContext.updateCurrentTestSuite({ error });
        }
      }
    }
    await this.afterExecution(project, this.testExecutionContext);
    this.testExecutionContext.endExecution();
    return result;
  }

  async onProject(project: Project, tec: TestExecutionContext) {
    await Promise.all(
      this.lifecycleHooks
        .filter((hook) => "onProject" in hook)
        .map((hook) => hook.onProject!(project, tec))
    );
  }

  async beforeExecution(
    project: Project,
    testExecutionContext: TestExecutionContext
  ) {
    await Promise.all(
      this.lifecycleHooks
        .filter((hook) => "beforeExecution" in hook)
        .map((hook) => hook.beforeExecution!(project, testExecutionContext))
    );
  }

  async afterExecution(
    project: Project,
    testExecutionContext: TestExecutionContext
  ) {
    testExecutionContext.logger.trace(
      "Executing 'afterExecution' lifecycle hooks..."
    );
    await Promise.all(
      this.lifecycleHooks
        .filter((hook) => "afterExecution" in hook)
        .map((hook) => hook.afterExecution!(project, testExecutionContext))
    );
    testExecutionContext.logger.trace(
      "Execution of 'afterExecution' lifecycle hooks completed."
    );
  }

  async afterRunFile(
    file: TestFile,
    project: Project,
    testExecutionContext: TestExecutionContext
  ) {
    await Promise.all(
      this.lifecycleHooks
        .filter((hook) => "afterRunFile" in hook)
        .map((hook) => hook.afterRunFile!(file, project, testExecutionContext))
    );
  }

  async beforeRunFile(
    file: TestFile,
    project: Project,
    testExecutionContext: TestExecutionContext
  ) {
    await Promise.all(
      this.lifecycleHooks
        .filter((hook) => "beforeRunFile" in hook)
        .map((hook) => hook.beforeRunFile!(file, project, testExecutionContext))
    );
  }

  async requestContext(
    testExecutionContext: TestExecutionContext,
    project: Project
  ): Promise<any> {
    const contexts = await Promise.all(
      this.lifecycleHooks
        .filter((hook) => "requestContext" in hook)
        .map((hook) => hook.requestContext!(testExecutionContext, project))
    );
    return contexts.reduce((ctx, context) => ({ ...ctx, ...context }), {
      ...global,
    });
  }

  async readFileContent(
    testFile: TestFile,
    project: Project,
    context: TestExecutionContext
  ): Promise<string> {
    const fileReaders = this.lifecycleHooks.filter(
      (hook) => "readFileContent" in hook
    );
    if (fileReaders.length >= 1) {
      const [fileReader] = fileReaders;
      return await fileReader.readFileContent!(testFile, project, context);
    } else {
      return new Promise<string>((res, rej) => {
        readFile(join(project.rootDir, testFile.path), (err, data) => {
          if (err) {
            rej(err);
          } else {
            res(data.toString());
          }
        });
      });
    }
  }

  private async registerSignalHandler(project: Project) {
    const handleSignal = async (signal: Signals) => {
      await Promise.all(
        this.lifecycleHooks
          .filter((hook) => "onSignal" in hook)
          .map((hook) =>
            hook.onSignal!(signal, project, this.testExecutionContext)
          )
      );

      if (signal === "SIGINT" || signal === "SIGTERM") {
        this.testExecutionContext.logger.info(
          `Received signal ${signal}, aborting execution`
        );
        process.exit(130);
      }
    };

    nodeSignals.forEach((signal) => {
      process.on(signal, handleSignal);
    });
  }

  private async notifyOfUnhandledError(project: Project, e: any) {
    await Promise.all(
      this.lifecycleHooks
        .filter((hook) => "onUnhandledError" in hook)
        .map((hook) =>
          hook.onUnhandledError!(e, project, this.testExecutionContext)
        )
    );
  }
  private registerUnhandledErrorNotifier(project: Project) {
    process.on("uncaughtException", async (e) => {
      this.testExecutionContext.logger.warn("Caught uncaughtException.");
      this.testExecutionContext.error = e;
      await this.notifyOfUnhandledError(project, e);
    });
    process.on("unhandledRejection", async (e) => {
      this.testExecutionContext.logger.warn("Caught unhandledRejection.");
      this.testExecutionContext.error = e as Error;
      await this.notifyOfUnhandledError(project, e);
    });
  }
}
