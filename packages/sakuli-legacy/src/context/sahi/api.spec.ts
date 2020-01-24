import { mockPartial } from "sneer";
import { ThenableWebDriver } from "selenium-webdriver";
import { sahiApi } from "./api";
import { createTestExecutionContextMock } from "../__mocks__";
import { SahiApi } from "./sahi-api.interface";

let getTimeoutMock = jest.fn();
let setTimeoutMock = jest.fn();

jest.mock('./accessor', () => ({
    accessorApi: jest.fn(),
    AccessorUtil: jest.fn().mockImplementation(() => ({
        getTimeout: getTimeoutMock,
        setTimeout: setTimeoutMock
    }))
}));

describe('SahiApi', () => {

    const mockDriver = mockPartial<ThenableWebDriver>({});
    const ctx = createTestExecutionContextMock();


    describe('global timeout', () => {
        let api: SahiApi;
        beforeEach(() => {
            api = sahiApi(mockDriver, ctx);
        });

        it('should setTimeout in AccessorUtil', () => {
            api._setFetchTimeout(10_000);
            expect(setTimeoutMock).toHaveBeenCalledWith(10_000);
        });

        it('should call getTimeout from AccessorUtils', () => {
            const returnValue = Math.random();
            getTimeoutMock.mockReturnValue(returnValue);
            const result = api._getFetchTimeout();
            expect(getTimeoutMock).toHaveBeenCalled();
            expect(result).toBe(returnValue);
        })
    })
});
