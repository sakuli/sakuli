import { Builder, ThenableWebDriver } from "selenium-webdriver";
import { ifPresent, Maybe, throwIfAbsent } from "@sakuli/commons";
import {
  createKeyboardApi,
  createLoggerObject,
  createMouseApi,
  createTestCaseClass,
  createThenableApplicationClass,
  createThenableEnvironmentClass,
  createThenableRegionClass,
  Key,
  MouseButton,
} from "./common";
import { sahiApi } from "./sahi/api";
import {
  Project,
  TestExecutionContext,
  TestExecutionLifecycleHooks,
  TestFile,
} from "@sakuli/core";
import { basename, dirname, join, parse, sep } from "path";
import { LegacyProjectProperties } from "../loader/legacy-project-properties.class";
import { promises as fs } from "fs";
import { LegacyApi } from "./legacy-api.interface";
import { createDriverFromProject } from "./selenium-config/create-driver-from-project.function";
import { TestStepCache } from "./common/test-case/steps-cache/test-step-cache.class";
import { NoopSahiApi } from "./noop-sahi-api.const";
import { SahiApi } from "./sahi/sahi-api.interface";
import { getActiveKeys } from "./common/button-registry";
import { releaseKeys } from "./common/release-keys.function";
import Signals = NodeJS.Signals;

export class LegacyLifecycleHooks implements TestExecutionLifecycleHooks {
  driver: Maybe<ThenableWebDriver> = null;

  /**
   * Path to the current Testsuite. Might be used in `requestContext`
   */
  currentTest: Maybe<string> = null;
  uiOnly = false;
  reuseBrowser = true;
  properties: Maybe<LegacyProjectProperties> = null;

  constructor(readonly builder: Builder) {}

  async onProject(
    project: Project,
    testExecutionContext: TestExecutionContext
  ) {
    this.properties = project.objectFactory(LegacyProjectProperties);
    this.uiOnly = this.properties.isUiOnly();
    this.reuseBrowser = this.properties.isReuseBrowser();
    if (!this.uiOnly && this.reuseBrowser) {
      await this.createDriver(project, testExecutionContext);
    }
  }

  async beforeExecution(
    project: Project,
    testExecutionContext: TestExecutionContext
  ) {
    const id = this.properties!.testsuiteId
      ? this.properties!.testsuiteId
      : project.rootDir.split(sep).pop();
    const warningTime = this.properties!.testsuiteWarningTime || 0;
    const criticalTime = this.properties!.testsuiteCriticalTime || 0;
    testExecutionContext.startTestSuite({ id, warningTime, criticalTime });
  }

  async afterExecution(
    project: Project,
    testExecutionContext: TestExecutionContext
  ) {
    testExecutionContext.endTestSuite();
    if (this.reuseBrowser) {
      await this.quitDriver(testExecutionContext);
    }
  }

  private currentFile: string = "";

  async beforeRunFile(
    file: TestFile,
    project: Project,
    testExecutionContext: TestExecutionContext
  ) {
    this.currentFile = file.path;
    this.currentTest = dirname(
      await fs.realpath(join(project.rootDir, file.path))
    );
    if (!this.reuseBrowser) {
      await this.createDriver(project, testExecutionContext);
    }
  }

  async afterRunFile(
    file: TestFile,
    project: Project,
    testExecutionContext: TestExecutionContext
  ) {
    const { name } = parse(file.path);
    ifPresent(testExecutionContext.getCurrentTestCase(), (ctc) => {
      if (!ctc.id) {
        testExecutionContext.updateCurrentTestCase({ id: name });
      }
    });
    if (!this.reuseBrowser) {
      await this.quitDriver(testExecutionContext);
    }
  }

  async requestContext(
    testExecutionContext: TestExecutionContext,
    project: Project
  ): Promise<LegacyApi> {
    const sahi: SahiApi = this.driver
      ? sahiApi(this.driver, testExecutionContext, this.properties!)
      : NoopSahiApi;
    const currentTestFolder = throwIfAbsent(
      this.currentTest,
      Error(
        "Could not initialize LegacyDslContext because no test folder was found / provided"
      )
    );
    const stepCacheFileName = basename(this.currentFile);
    const stepsCache = new TestStepCache(
      join(currentTestFolder, `.${stepCacheFileName}.steps.cache`)
    );
    return Promise.resolve({
      driver: this.driver!,
      context: testExecutionContext,
      TestCase: createTestCaseClass(
        testExecutionContext,
        project,
        this.currentTest,
        stepsCache
      ),
      Application: createThenableApplicationClass(
        testExecutionContext,
        project
      ),
      Key,
      MouseButton,
      Environment: createThenableEnvironmentClass(
        testExecutionContext,
        project
      ),
      Region: createThenableRegionClass(testExecutionContext, project),
      Logger: createLoggerObject(testExecutionContext),
      $includeFolder: "",
      ...sahi,
    });
  }

  private async createDriver(
    project: Project,
    testExecutionContext: TestExecutionContext
  ) {
    this.driver = createDriverFromProject(
      project,
      testExecutionContext,
      this.builder
    );
    await this.driver.manage().window().maximize();
    testExecutionContext.logger.debug("Created webdriver");
  }

  private async quitDriver(testExecutionContext: TestExecutionContext) {
    await ifPresent(
      this.driver,
      async (driver) => {
        try {
          await driver.quit();
          testExecutionContext.logger.debug("Closed webdriver");
        } catch (e) {
          testExecutionContext.logger.warn(
            `Webdriver doesn't quit reliably`,
            e
          );
        }
      },
      () => Promise.resolve()
    );
  }

  async onUnhandledError(
    error: any,
    project: Project,
    _: TestExecutionContext
  ) {
    await this.releaseKeys(project);
  }

  async onSignal(signal: Signals, project: Project, _: TestExecutionContext) {
    if (signal === "SIGINT" || signal === "SIGTERM") {
      await this.releaseKeys(project);
    }
  }

  private async releaseKeys(project: Project) {
    const properties = project.objectFactory(LegacyProjectProperties);
    const keyboardApi = createKeyboardApi(properties);
    const mouseApi = createMouseApi(properties);
    const buttonRegistry = getActiveKeys();
    await releaseKeys(buttonRegistry, mouseApi, keyboardApi);
  }
}
