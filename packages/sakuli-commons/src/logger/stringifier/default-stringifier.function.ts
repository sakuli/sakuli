import {LogEventStringifier} from "../log-consumer-adapter.interface";
import {LogEvent} from "../log-event.interface";
import {EOL} from "os";
import {LogLevel} from "../log-level.class";
import {inspect} from "util";

export const defaultStringifier: LogEventStringifier = (e: LogEvent) => {
    return `[${e.time}] ${LogLevel[e.level]}: ${e.message}${EOL}${e.data.map((d) => inspect(d, true, null, false)).join(EOL)}`
};