import {LegacyContextProvider} from "./legacy-context-provider.class";
import {Builder, Capabilities, ThenableWebDriver} from "selenium-webdriver";
import {mockPartial} from "sneer";
import {LegacyProjectProperties} from "../loader/legacy-project-properties.class";
import {isPresent} from "@sakuli/commons";

describe('LegacyContextProviderClass', () => {

    const driver: ThenableWebDriver = mockPartial<ThenableWebDriver>({
        quit: jest.fn()
    });

    const builder: Builder = mockPartial<Builder>({
        forBrowser: jest.fn(() => builder),
        withCapabilities: jest.fn(() => builder),
        build: jest.fn(() => driver)
    })

    describe('Sahi Api', () => {
        const lcp = new LegacyContextProvider(builder);
        const legacyProps = new LegacyProjectProperties();
        legacyProps.testsuiteBrowser = 'chrome';
        const minimumProject = {
            rootDir: '',
            testFiles: [],
            properties: legacyProps
        };

        it('should init webdriver with builder', () => {
            lcp.tearUp(minimumProject);
            expect(builder.forBrowser).toHaveBeenCalledWith('chrome');
            expect(builder.withCapabilities).toHaveBeenCalledWith(Capabilities.chrome());
        });

        it('should publish sahi function into context', () => {
            lcp.tearUp(minimumProject);
            const context = lcp.getContext();
            expect(context._navigateTo).toBeDefined()
        });

        it('should quit the webdriver in teardown', () => {
            lcp.tearUp(minimumProject);
            expect(lcp.driver).toBeDefined();
            if (isPresent(lcp.driver)) {
                jest.spyOn(lcp.driver, 'quit');
                lcp.tearDown();
                expect(lcp.driver.quit).toHaveBeenCalled();
            }
        });
    });

});