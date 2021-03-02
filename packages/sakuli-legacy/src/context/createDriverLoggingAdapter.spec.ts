import { Logs, Options, ThenableWebDriver } from "selenium-webdriver";
import { mockPartial } from "sneer";
import {
  createDriverLoggingAdapter,
  DriverLoggingAdapter,
} from "./createDriverLoggingAdapter";
import { SimpleLogger } from "@sakuli/commons";
import { Entry, Level } from "selenium-webdriver/lib/logging";
import { createTestExecutionContextMock } from "./__mocks__";

describe("createDriverLoggingAdapter", () => {
  let getAvailableLogTypesMock: () => Promise<string[]>;
  let getMock: (type: string) => Promise<Entry[]>;
  const driver = mockPartial<ThenableWebDriver>({
    manage: () =>
      mockPartial<Options>({
        logs: () =>
          mockPartial<Logs>({
            getAvailableLogTypes: getAvailableLogTypesMock,
            get: getMock,
          }),
      }),
  });
  let logger: SimpleLogger;
  let loggingAdapter: DriverLoggingAdapter;

  beforeEach(() => {
    getAvailableLogTypesMock = jest.fn().mockReturnValue(["Foobar", "Foo"]);
    getMock = jest.fn();

    logger = createTestExecutionContextMock().logger;

    loggingAdapter = createDriverLoggingAdapter(logger);
    loggingAdapter.setDriver(driver);
  });

  it("should request driver logs every 100ms", async (done) => {
    //GIVEN
    const wait = 250;
    const expectedCalledTimes = 6;

    //WHEN
    await loggingAdapter.start();

    //THEN
    setTimeout(() => {
      loggingAdapter.stop();
      expect(driver.manage().logs().get).toHaveBeenCalledTimes(
        expectedCalledTimes
      );
      done();
    }, wait);
  });

  it("should request driver only once if start and stop are called subsequently", async (done) => {
    //GIVEN
    const expectedCalledTimes = 2;
    const wait = 200;

    //WHEN
    await loggingAdapter.start();
    loggingAdapter.stop();

    //THEN
    setTimeout(() => {
      expect(driver.manage().logs().get).toHaveBeenCalledTimes(
        expectedCalledTimes
      );
      done();
    }, wait);
  });

  it("should forward SEVERE, WARNING, INFO and DEBUG selenium logs to sakuli DEBUG log", async (done) => {
    //GIVEN
    const expectedCalledTimes = 4;
    const wait = 200;
    const seleniumSevereMessage = new Entry(Level.SEVERE, "SEVERE");
    const seleniumWarningMessage = new Entry(Level.WARNING, "WARNING");
    const seleniumInfoMessage = new Entry(Level.INFO, "INFO");
    const seleniumDebugMessage = new Entry(Level.DEBUG, "DEBUG");
    getMock = jest
      .fn()
      .mockResolvedValueOnce([
        seleniumSevereMessage,
        seleniumWarningMessage,
        seleniumInfoMessage,
        seleniumDebugMessage,
      ]);

    //WHEN
    await loggingAdapter.start();
    loggingAdapter.stop();

    //THEN
    setTimeout(() => {
      expect(logger.trace).not.toHaveBeenCalled();
      expect(logger.info).not.toHaveBeenCalled();
      expect(logger.warn).not.toHaveBeenCalled();
      expect(logger.error).not.toHaveBeenCalled();
      expect(logger.debug).toHaveBeenCalledTimes(expectedCalledTimes);
      expect(logger.debug).toHaveBeenCalledWith(seleniumInfoMessage.message);
      expect(logger.debug).toHaveBeenCalledWith(seleniumWarningMessage.message);
      expect(logger.debug).toHaveBeenCalledWith(seleniumSevereMessage.message);
      expect(logger.debug).toHaveBeenCalledWith(seleniumDebugMessage.message);
      done();
    }, wait);
  });

  it("should forward FINE, FINER, FINEST selenium logs to sakuli TRACE log", async (done) => {
    //GIVEN
    const expectedCalledTimes = 3;
    const wait = 200;
    const seleniumFineMessage = new Entry(Level.FINE, "FINE");
    const seleniumFinerMessage = new Entry(Level.FINER, "FINER");
    const seleniumFinestMessage = new Entry(Level.FINEST, "FINEST");
    getMock = jest
      .fn()
      .mockResolvedValueOnce([
        seleniumFineMessage,
        seleniumFinerMessage,
        seleniumFinestMessage,
      ]);

    //WHEN
    await loggingAdapter.start();
    loggingAdapter.stop();

    //THEN
    setTimeout(() => {
      expect(logger.trace).toHaveBeenCalledTimes(expectedCalledTimes);
      expect(logger.trace).toHaveBeenCalledWith(seleniumFineMessage.message);
      expect(logger.trace).toHaveBeenCalledWith(seleniumFinerMessage.message);
      expect(logger.trace).toHaveBeenCalledWith(seleniumFinestMessage.message);
      expect(logger.debug).not.toHaveBeenCalled();
      expect(logger.info).not.toHaveBeenCalled();
      expect(logger.warn).not.toHaveBeenCalled();
      expect(logger.error).not.toHaveBeenCalled();
      done();
    }, wait);
  });
});
