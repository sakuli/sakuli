import {LogLevel} from "../log-level.class";
import {defaultStringifier} from "./default-stringifier.function";
import {EOL} from "os";
import {inspect} from "util";

describe("default-stringifier", () => {
    it("should stringify log events", () => {
        // GIVEN
        const level = LogLevel.INFO;
        const message = "teststring";
        const data = [
            {foo: "test1"},
            {bar: "test2"},
            {baz: "test3"},
        ];
        const dataString = data.map(d => inspect(d, true, null, false)).join(EOL);
        const log = {
            level,
            message,
            time: new Date(),
            data
        };

        // WHEN
        const result = defaultStringifier(log);

        // THEN
        expect(result).toContain(`${LogLevel[level]}: ${message}${EOL}${dataString}`);
    });
});