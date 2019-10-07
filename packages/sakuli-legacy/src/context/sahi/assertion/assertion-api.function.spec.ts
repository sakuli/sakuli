import { TestExecutionContext } from "@sakuli/core";
import { createTestExecutionContextMock } from "../__mocks__";
import { assertionApi } from "./assertion-api.function";

describe('assertion-api', () => {

    let api: ReturnType<typeof assertionApi>;
    let ctx: TestExecutionContext;

    beforeAll(async () => {
        ctx = createTestExecutionContextMock();
        api = assertionApi(ctx);
    });

    test('_assert should to do nothing, if given promise resolves to true', async () => {
        return expect(api._assert(Promise.resolve(true)))
            .resolves.toBeUndefined();
    });

    test('_assert should throw an exception, if given promise resolves to false', async () => {
        await expect(api._assert(Promise.resolve(false))).rejects.toThrow(Error);
        return expect(ctx.logger.error).toBeCalled();
    });

    test('_assert should use the exception message, if the assertion fails', async () => {

        //GIVEN
        const expectedMessage = 'The end is near!';
        const failingPromise = Promise.resolve(false);

        //WHEN + THEN
        await expect(api._assert(failingPromise, expectedMessage)).rejects.toThrow(Error(expectedMessage));
        return expect(ctx.logger.error).toBeCalledWith(expectedMessage, failingPromise);
    });

    test('_assertTrue should to do nothing, if given promise resolves to true', async () => {
        return expect(api._assertTrue(Promise.resolve(true)))
            .resolves.toBeUndefined();
    });

    test('_assertTrue should throw an exception, if given promise resolves to false', async () => {
        await expect(api._assertTrue(Promise.resolve(false))).rejects.toThrow(Error);
        return expect(ctx.logger.error).toBeCalled();
    });

    test('_assertTrue should use the exception message, if the assertion fails', async () => {

        //GIVEN
        const expectedMessage = 'The end is near!';
        const failingPromise = Promise.resolve(false);

        //WHEN + THEN
        await expect(api._assertTrue(failingPromise, expectedMessage)).rejects.toThrow(Error(expectedMessage));
        return expect(ctx.logger.error).toBeCalledWith(expectedMessage, failingPromise);
    });
});