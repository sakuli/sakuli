import {LogEventStringifier} from "../log-consumer-adapter.interface";
import {LogEvent} from "../log-event.interface";
import {EOL} from "os";
import {LogLevel} from "../log-level.class";
import {inspect} from "util";

const stringifyData = (data: string | number | object) => {
    switch(typeof data) {
        case "string":
        case "number":
        case "bigint":
        case "boolean":
        case "undefined":
            return data;
        default:
            return inspect(data, true, null, false)
    }
}

export const defaultStringifier: LogEventStringifier = (e: LogEvent) => {
    return `[${e.time}] ${LogLevel[e.level]}: ${e.message}${EOL}${e.data.map(stringifyData).join(EOL)}`
};
