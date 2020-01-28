import { LegacyLifecycleHooks } from "./legacy-lifecycle-hooks.class";
import { Builder, Capabilities, Options, ThenableWebDriver, Window } from "selenium-webdriver";
import { mockPartial } from "sneer";
import { LegacyProjectProperties } from "../loader/legacy-project-properties.class";
import { Project, TestExecutionContext } from "@sakuli/core";
import { TestFile } from "@sakuli/core/dist/loader/model/test-file.interface";
import { createPropertyMapMock } from "@sakuli/commons/dist/properties/__mocks__";
import { createTestExecutionContextMock } from "./__mocks__";
import Mock = jest.Mock;

describe("LegacyLifecycleHooks", () => {

    let builder: Builder;
    let lcp: LegacyLifecycleHooks;
    let window: Window;
    let options: Options;
    let driver: ThenableWebDriver;
    let minimumProject: Project;
    let testExecutionContext: TestExecutionContext;
    let legacyProps: LegacyProjectProperties;
    beforeEach(async() => {
        window = mockPartial<Window>({
            maximize: jest.fn()
        });

        options = mockPartial<Options>({
            window: jest.fn().mockReturnValue(window)
        });
        driver = mockPartial<ThenableWebDriver>({
            quit: jest.fn(),
            manage: jest.fn().mockReturnValue(options)

        });

        testExecutionContext = createTestExecutionContextMock();


        legacyProps = new LegacyProjectProperties();
        legacyProps.testsuiteBrowser = 'chrome';
        minimumProject = mockPartial<Project>({
            rootDir: '',
            testFiles: [],
            objectFactory: jest.fn().mockReturnValue(legacyProps),
            ...(createPropertyMapMock({

            }))
        });

        builder = mockPartial<Builder>({
            forBrowser: jest.fn(() => builder),
            withCapabilities: jest.fn(() => builder),
            setChromeOptions: jest.fn(() => builder),
            setSafari: jest.fn(() => builder),
            setIeOptions: jest.fn(() => builder),
            setFirefoxOptions: jest.fn(() => builder),
            build: jest.fn(() => driver)
        });
        lcp = new LegacyLifecycleHooks(builder);
    });

    afterEach(() => {
    });

    describe('Sahi Api', () => {

        it('should init webdriver with builder', async () => {
            await lcp.onProject(minimumProject);
            expect(builder.forBrowser).toHaveBeenCalledWith('chrome');
            await expect(builder.withCapabilities).toHaveBeenCalledWith(Capabilities.chrome());
        });

        it('should maximize browser after init', async () => {
            await lcp.onProject(minimumProject);
            expect(window.maximize).toHaveBeenCalled();
        });

        it('should publish sahi function into context', async () => {
            await lcp.onProject(minimumProject);
            lcp.currentTest = '/some/where/over/the/rainbow';
            const context = await lcp.requestContext(testExecutionContext, minimumProject);
            return expect(context._navigateTo).toBeDefined()
        });

        it('should quit the webdriver in teardown', async () => {
            await lcp.onProject(minimumProject);
            await expect(lcp.driver).toBeDefined();
            jest.spyOn(lcp.driver!, 'quit');
            await lcp.afterExecution(minimumProject, testExecutionContext);
            expect(lcp.driver!.quit).toHaveBeenCalled();
            expect(testExecutionContext.logger.debug).toHaveBeenCalledWith("Closed webdriver");
        });

        it('should log in case the webdriver in teardown errored', async () => {

            //GIVEN
            await lcp.onProject(minimumProject);
            await expect(lcp.driver).toBeDefined();
            const expectedError = Error("Oh no! Quit did some fuxi wuxi =/");
            lcp.driver!.quit = jest.fn().mockRejectedValue(expectedError);

            //THEN
            await lcp.afterExecution(minimumProject, testExecutionContext);

            //WHEN
            expect(testExecutionContext.logger.warn)
                .toHaveBeenCalledWith("Webdriver doesn't quit reliably", expectedError);
        });
    });

    describe('Lifecycle', () => {
        it('should set case id by file name', async () => {
            const file: TestFile = {
                path: 'my-suite/my-case/case1.js',
            };
            (testExecutionContext.getCurrentTestCase as Mock).mockReturnValue({});
            await lcp.afterRunFile(file, minimumProject, testExecutionContext);
            expect(testExecutionContext.updateCurrentTestCase).toHaveBeenCalledWith(
                expect.objectContaining({id: 'case1'})
            )
        });

        it('should set suite id by property', async () => {
            legacyProps.testsuiteId = 'from-property';
            (testExecutionContext.getCurrentTestCase as Mock).mockReturnValue({});
            await lcp.beforeExecution(minimumProject, testExecutionContext);
            expect(testExecutionContext.startTestSuite).toHaveBeenCalledWith(
                expect.objectContaining({id: 'from-property'})
            )
        });
    });

    describe('ui-only scenario', () => {
        const legacyProps = new LegacyProjectProperties();
        legacyProps.uiOnly = true;
        const uiOnlyProject = mockPartial<Project>({
            rootDir: '',
            testFiles: [],
            objectFactory: jest.fn().mockReturnValue(legacyProps),
            ...(createPropertyMapMock({}))
        });
        it('should prepare context for UI-Only test', async () => {
            await lcp.onProject(uiOnlyProject);
            expect(lcp.uiOnly).toBeTruthy();
            expect(builder.build).toHaveBeenCalledTimes(0);
            expect(lcp.driver).toBeNull();
        });

        it('should create a context without sahi api', async () => {
            await lcp.onProject(uiOnlyProject);
            lcp.currentTest = '';
            const context = await lcp.requestContext(testExecutionContext, uiOnlyProject);
            expect(context.driver).toBeNull();
            expect(() => {
                context._navigateTo('')
            }).toThrowError(/_navigateTo/)
        })
    });

});
