import {Builder, Capabilities, ThenableWebDriver} from 'selenium-webdriver';
import {ifPresent, Maybe, throwIfAbsent} from "@sakuli/commons";
import {createTestCaseClass} from "./common/test-case.class";
import {Application} from "./common/application.class";
import {Key} from "./common/key.class";
import {Environment} from "./common/environment.class";
import {sahiApi} from "./sahi/api";
import {Project, TestExecutionContext, TestExecutionLifecycleHooks} from "@sakuli/core";
import {TestFile} from "@sakuli/core/dist/loader/model/test-file.interface";
import {parse, sep} from "path";
import {createLoggerClass} from "./common/logger.class";

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

    constructor(
        readonly builder: Builder
    ) {

    }

    async onProject(project: Project) {
        //const props: LegacyProjectProperties = project.
        const browser: keyof typeof Capabilities = 'chrome';
        const capsProducer = throwIfAbsent(this.capabilityMap[browser], Error(`${browser} is not a valid browser`));
        const caps = capsProducer();
        this.driver = this.builder
            .forBrowser(browser)
            .withCapabilities(caps)
            .build();
    }

    async beforeExecution(project: Project, testExecutionContext: TestExecutionContext) {
        const id = project.rootDir.split(sep).pop();
        testExecutionContext.startTestSuite({id})
    }

    async afterExecution(project: Project, testExecutionContext: TestExecutionContext) {
        testExecutionContext.endTestSuite();
        ifPresent(this.driver, async driver => {
            try {
                await driver.quit()
            } catch (e) {
                console.warn(`Webdriver doesn't quit reliably`, e);
            }
        });
    }

    private currentFile: string = '';
    private currentProject: Maybe<Project>;

    async beforeRunFile(file: TestFile, project: Project, ctx: TestExecutionContext) {
        this.currentFile = file.path;
        this.currentProject = project;
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

    async requestContext(ctx: TestExecutionContext) {
        const driver = throwIfAbsent(this.driver,
            Error('Driver could not be initialized before creating sahi-api-context'));
        const sahi = sahiApi(driver, ctx);
        return Promise.resolve({
            driver,
            context: ctx,
            TestCase: createTestCaseClass(ctx),
            Application,
            Key,
            Environment,
            Logger: createLoggerClass(ctx),
            console: console,
            $includeFolder: '',
            ...sahi,
        })
    }

}