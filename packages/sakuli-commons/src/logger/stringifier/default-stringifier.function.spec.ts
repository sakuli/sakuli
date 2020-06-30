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

    expect(defaultStringifier(log)).toContain(
      `${LogLevel[LogLevel.DEBUG]}: Test${EOL}`+
        `Simple String${EOL}`+
        `30${EOL}`+
        `false${EOL}`+
        `{ foo: 'bar' }${EOL}`);
  });

  it("should display log output with a succeeding newline when data is given", () => {
    const log: LogEvent = {
      level: LogLevel.DEBUG,
      message: "Test",
      time: new Date(),
      data: [{ foo: "test1" }, { bar: "test2" }, { baz: "test3" }],
    };
    expect(defaultStringifier(log)).toBe(
      `[${log.time}] ${LogLevel[log.level]}: ${log.message}${EOL}` +
        `{ foo: 'test1' }${EOL}` +
        `{ bar: 'test2' }${EOL}` +
        `{ baz: 'test3' }${EOL}`
    );
  });

  it("should display log output with a succeeding newline when no data is given", () => {
    const log: LogEvent = {
      level: LogLevel.DEBUG,
      message: "Test",
      time: new Date(),
      data: [],
    };
    expect(defaultStringifier(log)).toBe(
      `[${log.time}] ${LogLevel[log.level]}: ${log.message}${EOL}`
    );
  });
});
