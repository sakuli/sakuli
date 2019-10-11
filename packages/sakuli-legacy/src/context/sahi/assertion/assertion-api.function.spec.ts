import { TestExecutionContext } from "@sakuli/core";
import { createTestExecutionContextMock } from "../__mocks__";
import { assertionApi } from "./assertion-api.function";
import { mockPartial } from "sneer";
import { FetchApi } from "../fetch";
import { By } from "selenium-webdriver";
import { SahiElementQuery } from "../sahi-element.interface";
import { AssertionError } from "assert";

describe('assertion-api', () => {

    let dummyQuery: SahiElementQuery = { locator: By.css(''), identifier: '', relations: [] }
    let api: ReturnType<typeof assertionApi>;
    let ctx: TestExecutionContext;
    let _containsTextMock = jest.fn();
    let fetchApiMock = mockPartial<FetchApi>({
        _containsText: _containsTextMock
    })

    beforeAll(async () => {
        ctx = createTestExecutionContextMock();
        api = assertionApi(ctx, fetchApiMock);
    });

    describe('_assert', () => {

        it('should to do nothing, if given promise resolves to true', async () => {
            await expect(api._assert(Promise.resolve(true)))
                .resolves.toBeUndefined();
        });

        it('should throw an exception, if given promise resolves to false', async () => {
            await expect(api._assert(Promise.resolve(false))).rejects.toThrow(AssertionError);
        });

        it('should use the exception message, if the assertion fails', async () => {

            //GIVEN
            const expectedMessage = 'The end is near!';
            const failingPromise = Promise.resolve(false);

            //WHEN + THEN
            await expect(api._assert(failingPromise, expectedMessage))
                .rejects.toThrow(new AssertionError({message: expectedMessage}));
        });
    })

    describe('_assertTrue', () => {

        it('should to do nothing, if given promise resolves to true', async () => {
            await expect(api._assertTrue(Promise.resolve(true)))
                .resolves.toBeUndefined();
        });

        it('should throw an exception, if given promise resolves to false', async () => {
            await expect(api._assertTrue(Promise.resolve(false))).rejects.toThrow(AssertionError);
        });

        it('should use the exception message, if the assertion fails', async () => {

            //GIVEN
            const expectedMessage = 'The end is near!';
            const failingPromise = Promise.resolve(false);

            //WHEN + THEN
            await expect(api._assertTrue(failingPromise, expectedMessage)).rejects.toThrow(new AssertionError({message: expectedMessage}));
        });
    })

    describe('_assertFalse', () => {
        it('should to do nothing, if given promise resolves to false', async () => {
            await expect(api._assertFalse(Promise.resolve(false)))
                .resolves.toBeUndefined();
        });

        it('should throw an exception, if given promise resolves to true', async () => {
            await expect(api._assertFalse(Promise.resolve(true))).rejects.toThrow(AssertionError);
        });

        it('should use the exception message, if the assertion fails', async () => {

            //GIVEN
            const expectedMessage = 'The end is near!';
            const failingPromise = Promise.resolve(true);

            //WHEN + THEN
            await expect(api._assertFalse(failingPromise, expectedMessage)).rejects.toThrow(new AssertionError({message: expectedMessage}));
        });
    });

    describe('_assertNotFalse', () => {
        it('should to do nothing, if given promise resolves to false', async () => {
            await expect(api._assertNotTrue(Promise.resolve(false)))
                .resolves.toBeUndefined();
        });

        it('should throw an exception, if given promise resolves to true', async () => {
            await expect(api._assertNotTrue(Promise.resolve(true))).rejects.toThrow(AssertionError);
        });

        it('should use the exception message, if the assertion fails', async () => {

            //GIVEN
            const expectedMessage = 'The end is near!';
            const failingPromise = Promise.resolve(true);

            //WHEN + THEN
            await expect(api._assertNotTrue(failingPromise, expectedMessage)).rejects.toThrow(new AssertionError({message: expectedMessage}));
        });
    });

    describe('_assertContainsText', () => {
        it('should to do nothing, if given promise resolves to false', async () => {
            _containsTextMock.mockResolvedValueOnce(true);
            await expect(api._assertContainsText("ABC", dummyQuery))
                .resolves.toBeUndefined();
            expect(_containsTextMock).toHaveBeenCalledWith(dummyQuery, 'ABC');
        });

        it('should throw an exception, if given promise resolves to true', async () => {
            _containsTextMock.mockResolvedValue(false);
            await expect(api._assertContainsText('ABC', dummyQuery)).rejects.toThrow(AssertionError);
        });

        it('should use the exception message, if the assertion fails', async () => {

            //GIVEN
            const expectedMessage = 'The end is near!';
            _containsTextMock.mockResolvedValue(false);

            //WHEN + THEN
            await expect(api._assertContainsText('ABC', dummyQuery, expectedMessage)).rejects.toThrow(new AssertionError({message: expectedMessage}));
        });
    });

    describe('_assertNotContainsText', () => {
        it('should to do nothing, if given promise resolves to false', async () => {
            _containsTextMock.mockResolvedValueOnce(false);
            await expect(api._assertNotContainsText("ABC", dummyQuery))
                .resolves.toBeUndefined();
            expect(_containsTextMock).toHaveBeenCalledWith(dummyQuery, 'ABC');
        });

        it('should throw an exception, if given promise resolves to true', async () => {
            _containsTextMock.mockResolvedValue(true);
            await expect(api._assertNotContainsText('ABC', dummyQuery)).rejects.toThrow(AssertionError);
        });

        it('should use the exception message, if the assertion fails', async () => {

            //GIVEN
            const expectedMessage = 'The end is near!';
            _containsTextMock.mockResolvedValue(true);

            //WHEN + THEN
            await expect(api._assertNotContainsText('ABC', dummyQuery, expectedMessage)).rejects.toThrow(new AssertionError({message: expectedMessage}));
        });
    });


});
