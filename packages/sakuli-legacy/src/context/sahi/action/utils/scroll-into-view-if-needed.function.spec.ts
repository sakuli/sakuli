import { WebDriver, WebElement } from "selenium-webdriver";
import { scrollIntoViewIfNeeded } from "./scroll-into-view-if-needed.function";
import { TestExecutionContext } from "@sakuli/core";
import { createTestExecutionContextMock } from "../../__mocks__";
import { mockPartial } from "sneer";

function mockExecuteScript(promise: Promise<void>) {
    const executeScriptFunction = jest.fn().mockResolvedValue(promise);
    return mockPartial<WebElement>({
        getDriver: () => mockPartial<WebDriver>({
            executeScript: executeScriptFunction
        })
    });
}

describe("scroll into view if needed", () => {

    let ctx: TestExecutionContext;

    beforeEach(() =>{
        ctx = createTestExecutionContextMock();
    });

    it("should resolve if element is null", async () => {

        //GIVEN

        //WHEN
        const scrollIntoView = scrollIntoViewIfNeeded((undefined as unknown) as WebElement, ctx);

        //THEN
        expect(await scrollIntoView).resolves;
        expect(ctx.logger.debug).toBeCalledWith("scroll into view failed: element was null or undefined")
    });

    it("should execute script on driver", async () => {

        //GIVEN
        const webElementMock = mockExecuteScript(Promise.resolve());
        //WHEN
        const scrollIntoView = scrollIntoViewIfNeeded(webElementMock, ctx);

        //THEN
        expect(await scrollIntoView).resolves;
        expect(webElementMock.getDriver().executeScript).toBeCalledWith(expect.any(String), webElementMock);
        expect(ctx.logger.trace).toBeCalledWith(expect.stringContaining("scroll into view started with element:"))
    });

    it("should resolve if script execution rejects", async () => {

        //GIVEN
        const webElementMock = mockExecuteScript(Promise.reject());

        //WHEN
        const scrollIntoView = scrollIntoViewIfNeeded(webElementMock, ctx);

        //THEN
        expect(await scrollIntoView).resolves;
        expect(webElementMock.getDriver().executeScript).toBeCalledWith(expect.any(String), webElementMock);
    })
});