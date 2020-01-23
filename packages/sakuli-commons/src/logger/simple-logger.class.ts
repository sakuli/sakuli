import { EventEmitter } from "events";
import { LogEvent } from "./log-event.interface";
import { LogLevel } from "./log-level.class";

export class SimpleLogger {
    private emitter = new EventEmitter;
    private level: LogLevel = LogLevel.INFO;

    constructor(logLevel: LogLevel = LogLevel.INFO) {
        this.level = logLevel;
    }

    set logLevel(logLevel: LogLevel) {
        this.level = logLevel;
    }

    get logLevel(): LogLevel {
        return this.level;
    }

    log(event: LogEvent) {
        if (event.level >= this.level) {
            this.emitter.emit('event', event);
        }
    }

    onEvent(eventConsumer: (event: LogEvent) => void) {
        this.emitter.on('event', eventConsumer);
        return () => {
            this.emitter.off('event', eventConsumer);
        }
    }

    trace(message: string, ...data: any[]) {
        this.log({
            level: LogLevel.TRACE,
            time: new Date(),
            message,
            data
        })
    }

    debug(message: string, ...data: any[]) {
        this.log({
            level: LogLevel.DEBUG,
            time: new Date(),
            message,
            data
        })
    }

    info(message: string, ...data: any[]) {
        this.log({
            level: LogLevel.INFO,
            time: new Date(),
            message,
            data
        })
    }

    warn(message: string, ...data: any[]) {
        this.log({
            level: LogLevel.WARN,
            time: new Date(),
            message,
            data
        })
    }

    error(message: string, ...data: any[]) {
        this.log({
            level: LogLevel.ERROR,
            time: new Date(),
            message,
            data
        })
    }
}