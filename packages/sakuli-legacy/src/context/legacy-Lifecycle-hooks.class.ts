import {Builder, Capabilities, ThenableWebDriver} from 'selenium-webdriver';
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
import {applyBrowserOptions, SeleniumProperties} from "./selenium-config";

export class LegacyLifecycleHooks implements TestExecutionLifecycleHooks {

    capabilityMap: { [key: string]: () => Capabilities } = {
        'chrome': () => Capabilities.chrome(),
        'firefox': () => Capabilities.firefox(),
        'edge': () => Capabilities.edge(),
        'safari': () => Capabilities.safari(),
        'ie': () => Capabilities.ie(),
        'phantomjs': () => Capabilities.phantomjs(),
        'htmlunit': () => Capabilities.htmlunit(),
        'htmlunitwithjs': () => Capabilities.htmlunitwithjs(),
    };
    driver: Maybe<ThenableWebDriver> = null;

    currentTest: Maybe<string> = null;

    constructor(
        readonly builder: Builder
    ) {

    }

    async onProject(project: Project) {
        //const props: LegacyProjectProperties = project.
        const properties = project.objectFactory(LegacyProjectProperties);
        const seleniumProperties = project.objectFactory(SeleniumProperties);
        const browser: keyof typeof Capabilities = properties.testsuiteBrowser;
        const capsProducer = throwIfAbsent(this.capabilityMap[browser], Error(`${browser} is not a valid browser`));
        const caps = capsProducer();

        this.builder
            .forBrowser(browser)
            .withCapabilities(caps);
        ifPresent(seleniumProperties.alertBehaviour, prop => {
            this.builder.setAlertBehavior(prop);
        });
        ifPresent(seleniumProperties.loggingPrefs, prop => {
            this.builder.setLoggingPrefs(prop)
        });
        ifPresent(seleniumProperties.proxy, prop => {
            this.builder.setProxy(prop)
        });
        ifPresent(seleniumProperties.httpAgent, prop => {
            this.builder.usingHttpAgent(prop)
        });
        ifPresent(seleniumProperties.server, prop => {
            this.builder.usingServer(prop);
        });
        applyBrowserOptions(browser, project, this.builder);
        this.driver = this.builder.build();
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
        const driver = throwIfAbsent(this.driver,
            Error('Driver could not be initialized before creating sahi-api-context'));
        const sahi = sahiApi(driver, ctx);
        return Promise.resolve({
            driver,
            context: ctx,
            TestCase: createTestCaseClass(ctx, project, this.currentTest),
            Application: createThenableApplicationClass(ctx, project),
            Key,
            MouseButton,
            Environment: createThenableEnvironmentClass(ctx, project),
            Region: createThenableRegionClass(ctx, project),
            Logger: createLoggerObject(ctx),
            console: console,
            $includeFolder: '',
            ...sahi,
        })
    }

}