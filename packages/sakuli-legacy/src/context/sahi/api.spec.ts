import { mockPartial } from "sneer";
import { ThenableWebDriver } from "selenium-webdriver";
import { sahiApi } from "./api";
import { createTestExecutionContextMock } from "../__mocks__";
import { SahiApi } from "./sahi-api.interface";
import { LegacyProjectProperties } from "../../loader/legacy-project-properties.class";
import { actionApi } from "./action";
import { TestExecutionContext } from "@sakuli/core";

let getTimeoutMock = jest.fn();
let setTimeoutMock = jest.fn();

jest.mock("./accessor", () => ({
  accessorApi: jest.fn(),
  AccessorUtil: jest.fn().mockImplementation(() => ({
    getTimeout: getTimeoutMock,
    setTimeout: setTimeoutMock,
  })),
}));

jest.mock("./action", () => ({
  actionApi: jest.fn(),
}));

describe("SahiApi", () => {
  let mockDriver: ThenableWebDriver;
  let ctx: TestExecutionContext;
  let properties: LegacyProjectProperties;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDriver = mockPartial<ThenableWebDriver>({});
    ctx = createTestExecutionContextMock();
    properties = mockPartial<LegacyProjectProperties>({});
  });

  describe("global timeout", () => {
    let api: SahiApi;
    beforeEach(() => {
      api = sahiApi(mockDriver, ctx, properties);
    });

    it("should setTimeout in AccessorUtil", () => {
      api._setFetchTimeout(10_000);
      expect(setTimeoutMock).toHaveBeenCalledWith(10_000);
    });

    it("should call getTimeout from AccessorUtils", () => {
      const returnValue = Math.random();
      getTimeoutMock.mockReturnValue(returnValue);
      const result = api._getFetchTimeout();
      expect(getTimeoutMock).toHaveBeenCalled();
      expect(result).toBe(returnValue);
    });
  });

  it("should call actionApi with correct parameters", () => {
    // GIVEN

    // WHEN
    sahiApi(mockDriver, ctx, properties);

    // THEN
    expect(actionApi).toHaveBeenCalledWith(
      mockDriver,
      expect.objectContaining({
        getTimeout: getTimeoutMock,
        setTimeout: setTimeoutMock,
      }),
      ctx,
      properties
    );
  });
});
