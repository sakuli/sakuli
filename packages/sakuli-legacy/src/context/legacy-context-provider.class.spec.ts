import {LegacyLifecycleHooks} from "./legacy-context-provider.class";
import {Builder, Capabilities, ThenableWebDriver} from "selenium-webdriver";
import {mockPartial} from "sneer";
import {LegacyProjectProperties} from "../loader/legacy-project-properties.class";
import {isPresent} from "@sakuli/commons";
import {TestExecutionContext} from "@sakuli/core";
import {TestFile} from "@sakuli/core/dist/loader/model/test-file.interface";
import Mock = jest.Mock;

describe('LegacyContextProviderClass', () => {

    const driver: ThenableWebDriver = mockPartial<ThenableWebDriver>({
        quit: jest.fn()
    });

    const testExecutionContext: TestExecutionContext = mockPartial<TestExecutionContext>({
        startTestCase: jest.fn(),
        endTestSuite: jest.fn(),
        startTestSuite: jest.fn(),
        getCurrentTestCase: jest.fn(),
        updateCurrentTestCase: jest.fn()
    });

    const builder: Builder = mockPartial<Builder>({
        forBrowser: jest.fn(() => builder),
        withCapabilities: jest.fn(() => builder),
        build: jest.fn(() => driver)
    });

    const lcp = new LegacyLifecycleHooks(builder);
    const legacyProps = new LegacyProjectProperties();
    legacyProps.testsuiteBrowser = 'chrome';
    const minimumProject = {
        rootDir: '',
        testFiles: [],
        properties: legacyProps
    };

    describe('Sahi Api', () => {

        it('should init webdriver with builder', () => {
            lcp.onProject(minimumProject);
            expect(builder.forBrowser).toHaveBeenCalledWith('chrome');
            expect(builder.withCapabilities).toHaveBeenCalledWith(Capabilities.chrome());
        });

        it('should publish sahi function into context', () => {
            lcp.onProject(minimumProject);
            const context = lcp.requestContext(testExecutionContext);
            expect(context._navigateTo).toBeDefined()
        });

        it('should quit the webdriver in teardown', () => {
            lcp.onProject(minimumProject);
            expect(lcp.driver).toBeDefined();
            if (isPresent(lcp.driver)) {
                jest.spyOn(lcp.driver, 'quit');
                lcp.afterExecution(minimumProject, testExecutionContext);
                expect(lcp.driver.quit).toHaveBeenCalled();
            }
        });
    });

    describe('Lifecycle', () => {
        it('should set suite id by file name', () => {
            const file: TestFile = {
                path: 'my-suite/my-case/case1.js',
            };
            (testExecutionContext.getCurrentTestCase as Mock).mockReturnValue({

            });
            lcp.afterRunFile(file, minimumProject, testExecutionContext);
            expect(testExecutionContext.updateCurrentTestCase).toHaveBeenCalledWith(
                expect.objectContaining({id: 'case1'})
            )
        });
    })

});