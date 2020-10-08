import { LogMode, parseLogMode } from "./log-mode";

describe("log-mode", () => {
  it("should return logMode CI when string input 'ci'", () => {
    expect(parseLogMode("ci")).toBe(LogMode.CI);
  });

  it("should return logMode LOG_FILE when string input 'logfile", () => {
    expect(parseLogMode("logfile")).toBe(LogMode.LOG_FILE);
  });

  it("should return undefined if string is not contained by enum", () => {
    expect(parseLogMode("something")).toBe(undefined);
  });
});
