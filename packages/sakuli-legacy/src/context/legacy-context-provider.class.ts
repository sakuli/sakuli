import {LegacyProject} from "../loader/legacy-project.class";
import {Builder, Capabilities, ThenableWebDriver} from 'selenium-webdriver';
import {ifPresent, isPresent, Maybe, throwIfAbsent} from "@sakuli/commons";
import {createTestCaseClass} from "./common/test-case.class";
import {Application} from "./common/application.class";
import {Key} from "./common/key.class";
import {Environment} from "./common/environment.class";
import {sahiApi} from "./sahi/api";
import {Project, TestExecutionContext, TestExecutionLifecycleHooks} from "@sakuli/core";
import {TestFile} from "@sakuli/core/dist/loader/model/test-file.interface";
import {isAbsolute, join, parse, sep} from "path";
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

    onProject(project: LegacyProject): void {
        const browser: keyof Capabilities = <keyof Capabilities>project.properties.testsuiteBrowser;
        const capsProducer = throwIfAbsent(this.capabilityMap[browser], Error(`${browser} is not a valid browser`));
        const caps = capsProducer();
        this.driver = this.builder
            .forBrowser(browser)
            .withCapabilities(caps)
            .build();
    }

    beforeExecution(project: Project, testExecutionContext: TestExecutionContext) {
        const id = project.rootDir.split(sep).pop();
        testExecutionContext.startTestSuite({id})
    }

    afterExecution(project: Project, testExecutionContext: TestExecutionContext): void {
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
    private currentProject: Maybe<LegacyProject>;

    beforeRunFile(file: TestFile, project: LegacyProject, ctx: TestExecutionContext): void {
        this.currentFile = file.path;
        this.currentProject = project;
    }

    afterRunFile(file: TestFile, project: LegacyProject, ctx: TestExecutionContext): void {
        const {name} = parse(file.path);
        ifPresent(ctx.getCurrentTestCase(),
            ctc => {
                if (!ctc.id) {
                    ctx.updateCurrentTestCase({id: name})
                }
            }
        );
    }

    requestContext(ctx: TestExecutionContext) {
        const driver = throwIfAbsent(this.driver,
            Error('Driver could not be initialized before creating sahi-api-context'));
        const sahi = sahiApi(driver, ctx);
        return ({
            driver,
            require: (path: string) => {
                if (path.startsWith('./') && this.currentFile && isPresent(this.currentProject)) {
                    const {dir} = parse(this.currentFile);
                    return isAbsolute(dir)
                        ? require(join(this.currentProject.rootDir, dir, path))
                        : require(join(process.cwd(), this.currentProject.rootDir, dir, path))
                } else {
                    return require(path);
                }
            },
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