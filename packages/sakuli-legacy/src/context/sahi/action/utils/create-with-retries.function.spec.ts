import { ThenableWebDriver, error, By, WebElement } from "selenium-webdriver"
import { createWithRetries } from "./create-with-retries.function"
import { mockPartial } from "sneer"
import { AccessorUtil } from "../../accessor"
import { createTestExecutionContextMock } from "../../__mocks__"
import { TestExecutionContext } from "@sakuli/core"
import { SahiElementQuery } from "../../sahi-element.interface"

describe('create-with-retries', () => {

    let driver: ThenableWebDriver
    let executeScript: jest.Mock;
    let accessorUtils: AccessorUtil;
    let ctx: TestExecutionContext;
    let action: jest.Mock;
    let fetchElement: jest.Mock;
    let webElementMock: WebElement;
    let withRetries: <ARGS extends any[], R>(r: number, fn: (...args: ARGS) => Promise<R>) => ((...args: ARGS) => Promise<R>);

    beforeEach(() => {
        webElementMock = mockPartial<WebElement>({});
        fetchElement = jest.fn().mockReturnValue(webElementMock);
        accessorUtils = mockPartial<AccessorUtil>({
            fetchElement
        })
        executeScript = jest.fn();
        driver = mockPartial<ThenableWebDriver>({
            executeScript
        })
        ctx = createTestExecutionContextMock();
        withRetries = createWithRetries(
            driver,
            accessorUtils,
            ctx
        );
    })

    it('should just call action and return the value if action succeeds', async () => {
        action = jest.fn().mockReturnValue('Success');
        const retryableAction = withRetries(5, action);
        await expect(retryableAction(1, 2)).resolves.toEqual('Success');
        expect(action).toHaveBeenCalledTimes(1);
        expect(action).toHaveBeenCalledWith(1, 2);
    });

    it('should retry action as long as action throws StaleElementReferenceErrors', async () => {
        action = jest.fn()
            .mockRejectedValueOnce(new error.StaleElementReferenceError())
            .mockRejectedValueOnce(new error.StaleElementReferenceError())
            .mockRejectedValueOnce(new error.StaleElementReferenceError())
            .mockResolvedValueOnce('Success')
        const retryableAction = withRetries(5, action);
        await expect(retryableAction(1, 2)).resolves.toEqual('Success');
        expect(action).toHaveBeenCalledTimes(4);
    });

    it('should throw after all retries', async () => {
        action = jest.fn()
            .mockRejectedValueOnce(new error.StaleElementReferenceError())
            .mockRejectedValueOnce(new error.StaleElementReferenceError())
            .mockRejectedValueOnce(new error.StaleElementReferenceError())
            .mockRejectedValueOnce(new error.StaleElementReferenceError())
        const retryableAction = withRetries(3, action);
        await expect(retryableAction(1, 2)).rejects.toThrowError(/Failed on an action after 3 attempts./);
        expect(action).toHaveBeenCalledTimes(3);
    });

    it('should try to bring elements to viewport on MoveTargetOutOfBoundsError', async () => {
        action = jest.fn()
            .mockRejectedValueOnce(new error.MoveTargetOutOfBoundsError())
            .mockResolvedValueOnce("Success")

        const retryableAction = withRetries(3, action);
        const query: SahiElementQuery = {
            locator: By.css('div'),
            identifier: 0,
            relations: []
        }
        await expect(retryableAction(query)).resolves.toBe('Success');
        expect(fetchElement).toHaveBeenCalledWith(query);
        expect(executeScript).toHaveBeenCalledWith(expect.stringContaining("scrollIntoView(false)"), webElementMock)
    });

    it('should try to bring elements to viewport on MoveTargetOutOfBoundsError if first try does not work', async () => {
        action = jest.fn()
            .mockRejectedValueOnce(new error.MoveTargetOutOfBoundsError())
            .mockRejectedValueOnce(new error.MoveTargetOutOfBoundsError())
            .mockResolvedValueOnce("Success")

        executeScript.mockResolvedValue(void 0);

        const retryableAction = withRetries(3, action);
        const query: SahiElementQuery = {
            locator: By.css('div'),
            identifier: 0,
            relations: []
        }
        await expect(retryableAction(query)).resolves.toBe('Success');
        expect(fetchElement).toHaveBeenCalledWith(query);
        expect(executeScript).toHaveBeenCalledWith(expect.stringContaining("scrollIntoView(false)"), webElementMock)
    });

    it('should throw on error which is not StaleElementReferenceError or MoveTargetOutOfBoundsError', async () => {
        action = jest.fn()
            .mockRejectedValueOnce(Error('Some error'));
        executeScript.mockResolvedValue(void 0);
        const retryableAction = withRetries(3, action);
        await expect(retryableAction(1, 2)).rejects.toThrowError(/Some error/);
        expect(action).toHaveBeenCalledTimes(1);
    })
})
