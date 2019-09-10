import {LogEventStringifier} from "../log-consumer-adapter.interface";
import {LogEvent} from "../log-event.interface";
import {EOL} from "os";
import {LogLevel} from "../log-level.class";

const createCircularReplacer = () => {
    const seen = new WeakSet();
    return (key: string, value: any) => {
        if(typeof value === 'object' && value != null) {
            if(seen.has(value)) {
                return `[Circular Reference]`
            }
            seen.add(value);
        }
        return value;
    }
};

const saveToJson = (d: any) => `${JSON.stringify(d, createCircularReplacer, 2)}${EOL}`;

export const defaultStringifier: LogEventStringifier = (e: LogEvent) => {
    return `[${e.time}] ${LogLevel[e.level]}: ${e.message}${EOL}${e.data.map(saveToJson)}`
};