import {SimpleLogger} from "../simple-logger.class";
import {defaultStringifier} from "../stringifier/default-stringifier.function";
import {LogConsumerAdapter} from "../log-consumer-adapter.interface";
import WriteStream = NodeJS.WritableStream

export const createWriteStreamConsumer = (stream: WriteStream): LogConsumerAdapter => {
    return (logger: SimpleLogger, stringifier = defaultStringifier) => {
        logger.onEvent(e => {
            stream.write(stringifier(e));
        });
        return () => {}
    }
};