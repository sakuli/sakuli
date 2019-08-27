import {Builder, ThenableWebDriver} from 'selenium-webdriver';
import {ifPresent, Maybe, throwIfAbsent} from "@sakuli/commons";
import {createTestCaseClass} from "./common/test-case";
import {Key} from "./common/key.class";
import {sahiApi} from "./sahi/api";
import {Project, TestExecutionContext, TestExecutionLifecycleHooks} from "@sakuli/core";
import {TestFile} from "@sakuli/core/dist/loader/model/test-file.interface";
import {dirname, join, parse, sep} from "path";
import {createLoggerObject} from "./common/logger";
import {LegacyProjectProperties} from "../loader/legacy-project-properties.class";
import {promises as fs} from "fs";
import {MouseButton} from "./common/button.class";
import {createThenableApplicationClass} from "./common/application";
import {createThenableEnvironmentClass} from "./common/environment";
import {createThenableRegionClass} from "./common/region";
import {LegacyApi} from "./legacy-api.interface";
import {createDriverFromProject} from "./selenium-config/create-driver-from-project.function";
import { TestStepCache } from './common/test-case/steps-cache/test-step-cache.class';
import {NoopSahiApi} from './noop-sahi-api.const'
import {SahiApi} from './sahi/sahi-api.interface';

export class LegacyLifecycleHooks implements TestExecutionLifecycleHooks {

    driver: Maybe<ThenableWebDriver> = null;

    /**
     * Path to the current Testsuite. Might be used in `requestContext`
     */
    currentTest: Maybe<string> = null;
    uiOnly = false;

    constructor(
        readonly builder: Builder
    ) {

    }

    async onProject(project: Project) {
        const properties = project.objectFactory(LegacyProjectProperties);
        this.uiOnly = properties.uiOnly;
        if (!this.uiOnly) {
            this.driver = createDriverFromProject(project, this.builder);
        }
    }

    async beforeExecution(project: Project, testExecutionContext: TestExecutionContext) {
        const properties = project.objectFactory(LegacyProjectProperties);
        const id = properties.testsuiteId
            ? properties.testsuiteId
            : project.rootDir.split(sep).pop();
        testExecutionContext.startTestSuite({id})
    }

    async afterExecution(project: Project, testExecutionContext: TestExecutionContext) {
        testExecutionContext.endTestSuite();
        await ifPresent(this.driver, async driver => {
            try {
                await driver.quit()
            } catch (e) {
                console.warn(`Webdriver doesn't quit reliably`, e);
            }
        }, () => Promise.resolve());
    }

    private currentFile: string = '';
    private currentProject: Maybe<Project>;

    async beforeRunFile(file: TestFile, project: Project, ctx: TestExecutionContext) {
        this.currentFile = file.path;
        this.currentProject = project;
        this.currentTest = dirname(await fs.realpath(join(project.rootDir, file.path)));
    }

    async afterRunFile(file: TestFile, project: Project, ctx: TestExecutionContext) {
        const {name} = parse(file.path);
        ifPresent(ctx.getCurrentTestCase(),
            ctc => {
                if (!ctc.id) {
                    ctx.updateCurrentTestCase({id: name})
                }
            }
        );
    }

    async requestContext(ctx: TestExecutionContext, project: Project): Promise<LegacyApi> {
        const sahi: SahiApi = this.driver ? sahiApi(this.driver, ctx) : NoopSahiApi;
        const currentTestFolder = throwIfAbsent(this.currentTest, Error('Could not initialize LegacyDslContext because no test folder was found / provided'))
        const stepsCache = new TestStepCache(currentTestFolder);
        return Promise.resolve({
            driver: this.driver!,
            context: ctx,
            TestCase: createTestCaseClass(ctx, project, this.currentTest, stepsCache),
            Application: createThenableApplicationClass(ctx, project),
            Key,
            MouseButton,
            Environment: createThenableEnvironmentClass(ctx, project),
            Region: createThenableRegionClass(ctx, project),
            Logger: createLoggerObject(ctx),
            $includeFolder: '',
            ...sahi,
        });

    }

}
