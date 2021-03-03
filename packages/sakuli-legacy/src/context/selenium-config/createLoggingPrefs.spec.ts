import { LogLevel, SimpleLogger } from "@sakuli/commons";
import { createLoggingPrefs } from "./createLoggingPrefs";
import { logging } from "selenium-webdriver";

describe("create logging prefs", () => {
  it("should configure driver log level to WARNING according to sakuli log level TRACE", () => {
    //GIVEN
    const loggerMock = new SimpleLogger(LogLevel.TRACE);
    const expectedLoggingAspects = [
      "driver",
      "performance",
      "client",
      "browser",
      "server",
    ];
    const expectedSeleniumLogLevel = logging.Level.WARNING;

    //WHEN
    const preferences = createLoggingPrefs(loggerMock);

    //THEN
    expect(preferences).toBeTruthy();
    expect(Array.from(preferences!.prefs_.keys())).toStrictEqual(
      expectedLoggingAspects
    );
    preferences!.prefs_.forEach((value) => {
      expect(value).toBe(expectedSeleniumLogLevel);
    });
  });
});
