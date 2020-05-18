import { LogLevel } from "../log-level.class";
import { defaultStringifier } from "./default-stringifier.function";
import { EOL } from "os";
import { inspect } from "util";
import { LogEvent } from "../log-event.interface";
import { stripIndents } from "common-tags";

describe("default-stringifier", () => {
  it("should stringify log events", () => {
    // GIVEN
    const level = LogLevel.INFO;
    const message = "teststring";
    const data = [{ foo: "test1" }, { bar: "test2" }, { baz: "test3" }];
    const dataString = data.map((d) => inspect(d, true, null, false)).join(EOL);
    const log = {
      level,
      message,
      time: new Date(),
      data,
    };

    // WHEN
    const result = defaultStringifier(log);

    // THEN
    expect(result).toContain(
      `${LogLevel[level]}: ${message}${EOL}${dataString}`
    );
  });

  it("should stringify log data for primitives without inspect", () => {
    const log: LogEvent = {
      level: LogLevel.DEBUG,
      message: "Test",
      time: new Date(),
      data: ["Simple String", 30, false, { foo: "bar" }],
    };

    expect(defaultStringifier(log)).toContain(stripIndents`${
      LogLevel[LogLevel.DEBUG]
    }: Test
        Simple String
        30
        false
        { foo: 'bar' }`);
  });
});
