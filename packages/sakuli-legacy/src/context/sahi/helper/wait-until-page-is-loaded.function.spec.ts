import { WebDriver } from "selenium-webdriver";
import { mockPartial } from "sneer";
import { waitUntilPageIsLoaded } from "./wait-until-page-is-loaded.function";
import { wait } from "./wait.function";
import { createTestExecutionContextMock } from "../../__mocks__";

jest.mock("./wait.function", () => ({wait: jest.fn()}));


describe("wait until page is loaded", () => {

    const timeout = 4;
    const interval = 1;

    const testExecutionContext = createTestExecutionContextMock();

    function createWebDriverMock () {
        function withMock(getPageSourceMock: jest.Mock){
            return mockPartial<WebDriver>({getPageSource: getPageSourceMock}); 
        }
        
        function withFourDomChanges(){
            return withMock(jest.fn()
                .mockResolvedValueOnce("<html></html>")
                .mockResolvedValueOnce("<html><div></div></html>")
                .mockResolvedValueOnce("<html></html>")
                .mockResolvedValueOnce("<html><div></div></html>")
                .mockResolvedValueOnce("<html></html>"));
        }

        function withOneDomChange(){
            return withMock(jest.fn()
                .mockResolvedValueOnce("<html></html>")
                .mockResolvedValue("<html><div></div></html>"));
        }
        
        return {
            withMock, 
            withFourDomChanges,
            withOneDomChange}
    }

    it("should wait if page is changing its dom over time", async () => {

        //GIVEN
        const webDriverMock = createWebDriverMock().withOneDomChange();

        //WHEN
        await waitUntilPageIsLoaded(webDriverMock, interval, timeout, testExecutionContext);

        //THEN
        expect(webDriverMock.getPageSource).toBeCalledTimes(3);
    });

    it("should not wait longer than the timeout defines", async () => {

        //GIVEN
        const webDriverMock = createWebDriverMock().withFourDomChanges();

        //WHEN
        await waitUntilPageIsLoaded(webDriverMock, interval, timeout, testExecutionContext);

        //THEN
        expect(webDriverMock.getPageSource).toBeCalledTimes(5);
    });

    it("should wait as long as the interval defines", async () => {

        //GIVEN
        const webDriverMock = createWebDriverMock().withMock(
                                    jest.fn().mockResolvedValue("<html></html>"));


        //WHEN
        await waitUntilPageIsLoaded(webDriverMock, interval, 2, testExecutionContext);

        //THEN
        expect(wait).toBeCalledWith(interval);
    });

    it("should log when waiting starts", async () => {

        //GIVEN
        const webDriverMock = createWebDriverMock().withOneDomChange();

        //WHEN
        await waitUntilPageIsLoaded(webDriverMock, interval, timeout, testExecutionContext);

        //THEN
        expect(testExecutionContext.logger.debug)
            .toHaveBeenCalledWith("Starting to wait until page is loaded");
    });

    it("should log when waiting ends before timeout", async () => {

        //GIVEN
        const webDriverMock = createWebDriverMock().withOneDomChange();

        //WHEN
        await waitUntilPageIsLoaded(webDriverMock, interval, timeout, testExecutionContext);

        //THEN
        expect(testExecutionContext.logger.debug)
            .toHaveBeenCalledWith("Finished page loading after 1ms");
    });

    it("should log when waiting ends because of timeout", async () => {

        //GIVEN
        const webDriverMock = createWebDriverMock().withFourDomChanges();

        //WHEN
        await waitUntilPageIsLoaded(webDriverMock, interval, timeout, testExecutionContext);

        //THEN
        expect(testExecutionContext.logger.debug)
            .toHaveBeenCalledWith("Page has not finished loading after a timeout of 4ms. " +
                "Continuing test execution");
    })
});