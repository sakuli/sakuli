import { LogMode, parseLogMode } from "./log-mode";

describe("log-mode", () => {
  it("should return logMode CI when string input 'ci'", () => {
    expect(parseLogMode("ci")).toBe(LogMode.CI);
  });

  it("should return logMode LOG_FILE when string input 'logFile", () => {
    expect(parseLogMode("logFile")).toBe(LogMode.LOG_FILE);
  });

  it("should return undefined if string is not contained by enum", () => {
    expect(parseLogMode("something")).toBe(undefined);
  });

  it("should return undefined if provided log mode is undefined", () => {
    expect(parseLogMode(undefined)).toBe(undefined);
  });

  it("should return undefined if provided log mode is null", () => {
    expect(parseLogMode(null)).toBe(undefined);
  });
});
