import { error } from "selenium-webdriver"
import { createWithRetries } from "./create-with-retries.function"
import { createTestExecutionContextMock } from "../../__mocks__"
import { TestExecutionContext } from "@sakuli/core"

describe('create-with-retries', () => {

    let executeScript: jest.Mock;
    let ctx: TestExecutionContext;
    let action: jest.Mock;
    let withRetries: <ARGS extends any[], R>(r: number, fn: (...args: ARGS) => Promise<R>) => ((...args: ARGS) => Promise<R>);

    beforeEach(() => {
        ctx = createTestExecutionContextMock();
        withRetries = createWithRetries(
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

    it('should throw on error which is not StaleElementReferenceError or MoveTargetOutOfBoundsError', async () => {
        action = jest.fn()
            .mockRejectedValueOnce(Error('Some error'));
        const retryableAction = withRetries(3, action);
        await expect(retryableAction(1, 2)).rejects.toThrowError(/Some error/);
        expect(action).toHaveBeenCalledTimes(1);
    })
})
