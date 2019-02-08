import {EventEmitter} from "events";
import {LogEvent} from "./log-event.interface";

export class SimpleLogger {
    private emitter = new EventEmitter;
    constructor() {
    }

    log(event: LogEvent) {
        this.emitter.emit('event', event);
    }

    onEvent(eventConsumer:(event: LogEvent) => void) {
        this.emitter.on('event', eventConsumer);
        return () => {
            this.emitter.off('event', eventConsumer);
        }
    }

    debug(message: string, ...data:any[]) {
        this.log({
            level: 'DEBUG',
            time: new Date(),
            message,
            data
        })
    }

    info(message: string, ...data:any[]) {
        this.log({
            level: 'INFO',
            time: new Date(),
            message,
            data
        })
    }

    warn(message: string, ...data:any[]) {
        this.log({
            level: 'WARN',
            time: new Date(),
            message,
            data
        })
    }

    error(message: string, ...data:any[]) {
        this.log({
            level: 'ERROR',
            time: new Date(),
            message,
            data
        })
    }

}