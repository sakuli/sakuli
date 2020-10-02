import { LogMode, parseLogMode } from "./log-mode";

describe("log-mode", () => {
  it("should return logMode corresponding to string input", () => {
    expect(parseLogMode("ci")).toBe(LogMode.CI);
  });

  it("should return undefined if string is not contained by enum", () => {
    expect(parseLogMode("something")).toBe(undefined);
  });
});
