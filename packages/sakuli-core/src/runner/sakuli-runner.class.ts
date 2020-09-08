import { Project, TestFile } from "../loader/model";
import { TestExecutionLifecycleHooks } from "./context-provider.interface";
import { TestScriptExecutor } from "./test-script-executor.interface";
import { readFile } from "fs";
import { JsScriptExecutor } from "./js-script-executor.class";
import { join, resolve } from "path";
import { TestExecutionContext } from "./test-execution-context";
import Signals = NodeJS.Signals;
import { nodeSignals } from "../node-signals";
import {
  LifecycleHookRegistry,
  lifecycleHookRegistry,
} from "./lifecycle-hook-registry";

export class SakuliRunner implements TestExecutionLifecycleHooks {
  private hookRegistry: LifecycleHookRegistry;

  constructor(
    readonly lifecycleHooks: TestExecutionLifecycleHooks[],
    readonly testExecutionContext: TestExecutionContext,
    readonly testFileExecutor: TestScriptExecutor = new JsScriptExecutor()
  ) {
    this.hookRegistry = lifecycleHookRegistry(lifecycleHooks);
  }

  /**
   * Tears up all lifecycle-hooks, merges their results of getContext and pass this result to the testFile Executor
   * Tears down all service providers after execution of each testFile
   *
   * @param project The Project Structure found by a Project loader
   * @returns a merged object from all provided contexts after their execution
   */
  async execute(project: Project): Promise<any> {
    this.registerSignalHandler(project);
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
      this.hookRegistry
        .getOnProjectHooks()
        .map((hook) => hook.onProject!(project, tec))
    );
  }

  async beforeExecution(
    project: Project,
    testExecutionContext: TestExecutionContext
  ) {
    await Promise.all(
      this.hookRegistry
        .getBeforeExecutionHooks()
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
      this.hookRegistry
        .getAfterExecutionHooks()
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
      this.hookRegistry
        .getAfterRunFileHooks()
        .map((hook) => hook.afterRunFile!(file, project, testExecutionContext))
    );
  }

  async beforeRunFile(
    file: TestFile,
    project: Project,
    testExecutionContext: TestExecutionContext
  ) {
    await Promise.all(
      this.hookRegistry
        .getBeforeRunFileHooks()
        .map((hook) => hook.beforeRunFile!(file, project, testExecutionContext))
    );
  }

  async requestContext(
    testExecutionContext: TestExecutionContext,
    project: Project
  ): Promise<any> {
    const contexts = await Promise.all(
      this.hookRegistry
        .getRequestContextHooks()
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
    const fileReaders = this.hookRegistry.getReadFileContentHooks();
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

  private registerSignalHandler(project: Project) {
    const handleSignal = async (signal: Signals) => {
      this.testExecutionContext.logger.trace(
        `Forwarding ${signal} to lifecycle hooks...`
      );
      await Promise.all(
        this.hookRegistry
          .getOnSignalHooks()
          .map((hook) =>
            hook.onSignal!(signal, project, this.testExecutionContext)
          )
      );
      this.testExecutionContext.logger.trace(
        `Forwarding of Signal ${signal} to lifecycle hooks completed`
      );

      if (signal === "SIGINT" || signal === "SIGTERM") {
        this.testExecutionContext.logger.info(
          `Received signal ${signal}, aborting execution`
        );
        process.exit(130);
      }
    };

    this.testExecutionContext.logger.trace(
      "Registering process signal handler"
    );
    nodeSignals.forEach((signal) => {
      process.on(signal, handleSignal);
    });
  }

  private registerUnhandledErrorNotifier(project: Project) {
    this.testExecutionContext.logger.trace(
      "Registering uncaughtException handler"
    );

    const notifyOfUnhandledError = async (currentProject: Project, e: any) => {
      this.testExecutionContext.logger.trace(
        "Forwarding unhandled error to lifecycle hooks..."
      );
      await Promise.all(
        this.hookRegistry
          .getOnUnhandledErrorHooks()
          .map((hook) =>
            hook.onUnhandledError!(e, currentProject, this.testExecutionContext)
          )
      );
      this.testExecutionContext.logger.trace(
        "Forwarding of unhandled error to lifecycle hooks completed"
      );
    };

    process.on("uncaughtException", async (e) => {
      this.testExecutionContext.logger.warn("Caught uncaughtException.");
      this.testExecutionContext.error = e;
      await notifyOfUnhandledError(project, e);
    });
    this.testExecutionContext.logger.trace(
      "Registering unhandledRejection handler"
    );
    process.on("unhandledRejection", async (e) => {
      this.testExecutionContext.logger.warn("Caught unhandledRejection.");
      this.testExecutionContext.error = e as Error;
      await notifyOfUnhandledError(project, e);
    });
  }
}
