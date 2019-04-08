import {LegacyLifecycleHooks} from "./legacy-Lifecycle-hooks.class";
import {Builder, Capabilities, ThenableWebDriver} from "selenium-webdriver";
import {mockPartial} from "sneer";
import {LegacyProjectProperties} from "../loader/legacy-project-properties.class";
import {Project, TestExecutionContext} from "@sakuli/core";
import {TestFile} from "@sakuli/core/dist/loader/model/test-file.interface";
import Mock = jest.Mock;
import {createPropertyMapMock} from "@sakuli/commons/dist/properties/__mocks__";

describe(LegacyLifecycleHooks.name, () => {

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
    const minimumProject = mockPartial<Project>({
        rootDir: '',
        testFiles: [],
        objectFactory: jest.fn().mockReturnValue(legacyProps),
        ...(createPropertyMapMock({

        }))
    });

    describe('Sahi Api', () => {

        it('should init webdriver with builder', async () => {
            await lcp.onProject(minimumProject);
            expect(builder.forBrowser).toHaveBeenCalledWith('chrome');
            return expect(builder.withCapabilities).toHaveBeenCalledWith(Capabilities.chrome());
        });

        it('should publish sahi function into context', async () => {
            await lcp.onProject(minimumProject);
            const context = await lcp.requestContext(testExecutionContext);
            return expect(context._navigateTo).toBeDefined()
        });

        it('should quit the webdriver in teardown', async () => {
            await lcp.onProject(minimumProject);
            await expect(lcp.driver).toBeDefined();
            jest.spyOn(lcp.driver!, 'quit');
            await lcp.afterExecution(minimumProject, testExecutionContext);
            return expect(lcp.driver!.quit).toHaveBeenCalled();
        });
    });

    describe('Lifecycle', () => {
        it('should set suite id by file name', async () => {
            const file: TestFile = {
                path: 'my-suite/my-case/case1.js',
            };
            (testExecutionContext.getCurrentTestCase as Mock).mockReturnValue({});
            await lcp.afterRunFile(file, minimumProject, testExecutionContext);
            expect(testExecutionContext.updateCurrentTestCase).toHaveBeenCalledWith(
                expect.objectContaining({id: 'case1'})
            )
        });
    })

});