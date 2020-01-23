import { WebDriver } from "selenium-webdriver";
import { mockPartial } from "sneer";
import { waitUntilPageIsLoaded } from "./wait-until-page-is-loaded.function";
import { wait } from "./wait.function";

jest.mock("./wait.function", () => ({wait: jest.fn()}));


describe("wait until page is loaded", () => {

    const timeout = 4;
    const interval = 1;

    function createWebDriverMock (getPageSourceMock: jest.Mock) {
        return mockPartial<WebDriver>({getPageSource: getPageSourceMock});
    }

    it("should wait if page is changing its dom over time", async () => {

        //GIVEN
        const webDriverMock = createWebDriverMock(jest.fn()
            .mockResolvedValueOnce("<html></html>")
            .mockResolvedValue("<html><div></div></html>"));

        //WHEN
        await waitUntilPageIsLoaded(webDriverMock, interval, timeout);

        //THEN
        expect(webDriverMock.getPageSource).toBeCalledTimes(3);
    });

    it("should not wait longer than the timeout defines", async () => {

        //GIVEN
        const webDriverMock = createWebDriverMock(jest.fn()
            .mockResolvedValueOnce("<html></html>")
            .mockResolvedValueOnce("<html><div></div></html>")
            .mockResolvedValueOnce("<html></html>")
            .mockResolvedValueOnce("<html><div></div></html>")
            .mockResolvedValueOnce("<html></html>"));

        //WHEN
        await waitUntilPageIsLoaded(webDriverMock, interval, timeout);

        //THEN
        expect(webDriverMock.getPageSource).toBeCalledTimes(5);
    });

    it("should wait as long as the interval defines", async () => {

        //GIVEN
        const webDriverMock = createWebDriverMock(
            jest.fn().mockResolvedValue("<html></html>"));


        //WHEN
        await waitUntilPageIsLoaded(webDriverMock, interval, 2);

        //THEN
        expect(wait).toBeCalledWith(interval);
    })
});