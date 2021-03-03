import { Logs, Options, ThenableWebDriver } from "selenium-webdriver";
import { mockPartial } from "sneer";
import {
  createDriverLoggingAdapter,
  DriverLoggingAdapter,
} from "./createDriverLoggingAdapter";
import { LogLevel, SimpleLogger } from "@sakuli/commons";
import { Entry, Level } from "selenium-webdriver/lib/logging";
import { createTestExecutionContextMock } from "./__mocks__";

describe("createDriverLoggingAdapter", () => {
  let getAvailableLogTypesMock: () => Promise<string[]>;
  let getMock: (type: string) => Promise<Entry[]>;
  let getCurrentUrlMock: () => Promise<string> = jest
    .fn()
    .mockResolvedValue("http://sakuli.io");
  const driver = mockPartial<ThenableWebDriver>({
    manage: () =>
      mockPartial<Options>({
        logs: () =>
          mockPartial<Logs>({
            getAvailableLogTypes: getAvailableLogTypesMock,
            get: getMock,
          }),
      }),
    getCurrentUrl: getCurrentUrlMock,
  });
  let logger: SimpleLogger;
  let loggingAdapter: DriverLoggingAdapter;

  beforeEach(() => {
    getAvailableLogTypesMock = jest.fn().mockReturnValue(["Foobar", "Foo"]);
    getMock = jest.fn();

    logger = createTestExecutionContextMock().logger;
    logger.logLevel = LogLevel.TRACE;

    loggingAdapter = createDriverLoggingAdapter(logger);
    loggingAdapter.setDriver(driver);
  });

  function expectNothingWasLogged() {
    expect(logger.trace).not.toHaveBeenCalled();
    expect(logger.debug).not.toHaveBeenCalled();
    expect(logger.info).not.toHaveBeenCalled();
    expect(logger.warn).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  }

  it("should request driver logs on Sakuli TRACE log level every 100ms", async (done) => {
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

  it.each<LogLevel>([
    LogLevel.ERROR,
    LogLevel.WARN,
    LogLevel.INFO,
    LogLevel.DEBUG,
  ])(
    "should not request driver logs on Sakuli log level %s",
    async (loglevel: LogLevel, done: any) => {
      //GIVEN
      const wait = 250;
      logger.logLevel = loglevel;

      //WHEN
      await loggingAdapter.start();

      //THEN
      setTimeout(() => {
        loggingAdapter.stop();
        expect(driver.manage().logs().get).not.toBeCalled();
        done();
      }, wait);
    }
  );

  it("should do nothing if no driver has been set", async (done) => {
    //GIVEN
    const wait = 250;
    loggingAdapter = createDriverLoggingAdapter(logger);

    //WHEN
    await loggingAdapter.start();

    //THEN
    setTimeout(() => {
      loggingAdapter.stop();
      expectNothingWasLogged();
      done();
    }, wait);
  });

  it("should do nothing if driver has been closed", async (done) => {
    //GIVEN
    const wait = 250;
    const driver = mockPartial<ThenableWebDriver>({
      getCurrentUrl: jest.fn().mockRejectedValue("Driver has been closed"),
    });
    loggingAdapter.setDriver(driver);

    //WHEN
    await loggingAdapter.start();

    //THEN
    setTimeout(() => {
      loggingAdapter.stop();
      expectNothingWasLogged();
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

  it("should forward SEVERE and WARNING selenium logs to sakuli TRACE log", async (done) => {
    //GIVEN
    const expectedCalledTimes = 2;
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
      expect(logger.debug).not.toHaveBeenCalled();
      expect(logger.info).not.toHaveBeenCalled();
      expect(logger.warn).not.toHaveBeenCalled();
      expect(logger.error).not.toHaveBeenCalled();
      expect(logger.trace).toHaveBeenCalledTimes(expectedCalledTimes);
      expect(logger.trace).toHaveBeenCalledWith(
        expect.stringContaining(seleniumWarningMessage.message)
      );
      expect(logger.trace).toHaveBeenCalledWith(
        expect.stringContaining(seleniumSevereMessage.message)
      );
      done();
    }, wait);
  });

  it("should not forward selenium logs of FINE, FINER, FINEST, INFO, DEBUG to sakuli", async (done) => {
    //GIVEN
    const wait = 200;
    const seleniumFineMessage = new Entry(Level.FINE, "FINE");
    const seleniumFinerMessage = new Entry(Level.FINER, "FINER");
    const seleniumFinestMessage = new Entry(Level.FINEST, "FINEST");
    const seleniumInfoMessage = new Entry(Level.INFO, "INFO");
    const seleniumDebugMessage = new Entry(Level.DEBUG, "DEBUG");
    getMock = jest
      .fn()
      .mockResolvedValueOnce([
        seleniumFineMessage,
        seleniumFinerMessage,
        seleniumFinestMessage,
        seleniumInfoMessage,
        seleniumDebugMessage,
      ]);

    //WHEN
    await loggingAdapter.start();
    loggingAdapter.stop();

    //THEN
    setTimeout(() => {
      expectNothingWasLogged();
      done();
    }, wait);
  });
});
