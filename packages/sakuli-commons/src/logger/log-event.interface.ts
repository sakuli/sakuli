import {LogLevel} from "./log-level.class";

export interface LogEvent {
    level: LogLevel,
    message: string,
    time: Date,
    data: any[]
}

