import {LegacyProject} from "../loader/legacy-project.class";
import webdriver, {Capabilities} from 'selenium-webdriver';
import {ifPresent, Maybe, throwIfAbsent} from "@sakuli/commons";
import {createTestCaseClass} from "./common/test-case.class";
import {Application} from "./common/application.class";
import {Key} from "./common/key.class";
import {Environment} from "./common/environment.class";
import {SahiApi} from "./sahi/api";
import {Project, Sakuli, TestExecutionContext, TestExecutionLifecycleHooks} from "@sakuli/core";
import {TestFile} from "@sakuli/core/dist/loader/model/test-file.interface";
import {parse, sep} from "path";
import {relationsApi} from "./sahi/relations/relations-api.function";
import {actionApi} from "./sahi/action";
import {accessorApi, AccessorUtil} from "./sahi/accessor";
import {RelationsResolver} from "./sahi/relations";

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
    driver: Maybe<webdriver.ThenableWebDriver> = null;

    constructor(
        readonly builder: webdriver.Builder
    ) {
    }

    onProject(project: LegacyProject): void {
        const browser: keyof webdriver.Capabilities = <keyof webdriver.Capabilities>project.properties.testsuiteBrowser;
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


    beforeRunFile(file: TestFile, project: LegacyProject, ctx: TestExecutionContext): void {
    }

    afterRunFile(file: TestFile, project: LegacyProject, ctx: TestExecutionContext): void {
        const {name} = parse(file.path);
        ifPresent(ctx.getCurrentTestCase(),
            ctc => {
                if(!ctc.id) {
                    ctx.updateCurrentTestCase({id: name})
                }
            }
        );
    }

    requestContext(ctx: TestExecutionContext) {
        const driver =throwIfAbsent(this.driver,
            Error('Driver could not be initialized before creating sahi-api-context'));
        const sahi = new SahiApi(driver,ctx);
        const sahiRelations = relationsApi(driver, ctx);
        const sahiAccessors = accessorApi();
        const sahiActions = actionApi(
            driver,
            new AccessorUtil(driver, ctx, new RelationsResolver(
                driver, ctx
            )),
            ctx
        )
        return ({
            TestCase: createTestCaseClass(ctx),
            Application,
            Key,
            Environment,
            console: console,
            $includeFolder: '',
            ...sahi,
            ...sahiRelations,
            ...sahiActions,
            ...sahiAccessors
        })
    }


}