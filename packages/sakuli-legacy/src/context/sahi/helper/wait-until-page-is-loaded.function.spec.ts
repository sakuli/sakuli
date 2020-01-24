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

    function createWebDriverMock (getPageSourceMock: jest.Mock) {
        return mockPartial<WebDriver>({getPageSource: getPageSourceMock});
    }

    it("should wait if page is changing its dom over time", async () => {

        //GIVEN
        // noinspection HtmlRequiredLangAttribute
        const webDriverMock = createWebDriverMock(jest.fn()
            .mockResolvedValueOnce("<html></html>")
            .mockResolvedValue("<html><div></div></html>"));

        //WHEN
        await waitUntilPageIsLoaded(webDriverMock, interval, timeout, testExecutionContext);

        //THEN
        expect(webDriverMock.getPageSource).toBeCalledTimes(3);
    });

    it("should not wait longer than the timeout defines", async () => {

        //GIVEN
        // noinspection HtmlRequiredLangAttribute
        const webDriverMock = createWebDriverMock(jest.fn()
            .mockResolvedValueOnce("<html></html>")
            .mockResolvedValueOnce("<html><div></div></html>")
            .mockResolvedValueOnce("<html></html>")
            .mockResolvedValueOnce("<html><div></div></html>")
            .mockResolvedValueOnce("<html></html>"));

        //WHEN
        await waitUntilPageIsLoaded(webDriverMock, interval, timeout, testExecutionContext);

        //THEN
        expect(webDriverMock.getPageSource).toBeCalledTimes(5);
    });

    it("should wait as long as the interval defines", async () => {

        //GIVEN
        // noinspection HtmlRequiredLangAttribute
        const webDriverMock = createWebDriverMock(
            jest.fn().mockResolvedValue("<html></html>"));


        //WHEN
        await waitUntilPageIsLoaded(webDriverMock, interval, 2, testExecutionContext);

        //THEN
        expect(wait).toBeCalledWith(interval);
    });

    it("should log when waiting starts", async () => {

        //GIVEN
        // noinspection HtmlRequiredLangAttribute
        const webDriverMock = createWebDriverMock(jest.fn()
            .mockResolvedValueOnce("<html></html>")
            .mockResolvedValue("<html><div></div></html>"));

        //WHEN
        await waitUntilPageIsLoaded(webDriverMock, interval, timeout, testExecutionContext);

        //THEN
        expect(testExecutionContext.logger.debug)
            .toHaveBeenCalledWith("Starting to wait until page is loaded");
    });

    it("should log when waiting ends before timeout", async () => {

        //GIVEN
        // noinspection HtmlRequiredLangAttribute
        const webDriverMock = createWebDriverMock(jest.fn()
            .mockResolvedValueOnce("<html></html>")
            .mockResolvedValueOnce("<html><div></div></html>")
            .mockResolvedValue("<html><div><a></a></div></html>"));

        //WHEN
        await waitUntilPageIsLoaded(webDriverMock, interval, timeout, testExecutionContext);

        //THEN
        expect(testExecutionContext.logger.debug)
            .toHaveBeenCalledWith("Finished page loading after 2ms");
    });

    it("should log when waiting ends because of timeout", async () => {

        //GIVEN
        // noinspection HtmlRequiredLangAttribute
        const webDriverMock = createWebDriverMock(jest.fn()
            .mockResolvedValueOnce("<html></html>")
            .mockResolvedValueOnce("<html><div></div></html>")
            .mockResolvedValueOnce("<html></html>")
            .mockResolvedValueOnce("<html><div></div></html>")
            .mockResolvedValueOnce("<html></html>"));

        //WHEN
        await waitUntilPageIsLoaded(webDriverMock, interval, timeout, testExecutionContext);

        //THEN
        expect(testExecutionContext.logger.debug)
            .toHaveBeenCalledWith("Page has not finished loading after a timeout of 4ms. " +
                "Continuing test execution");
    })
});