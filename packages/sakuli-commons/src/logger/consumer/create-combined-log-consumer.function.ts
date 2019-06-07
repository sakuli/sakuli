import {LogConsumerAdapter} from "../log-consumer-adapter.interface";
import {defaultStringifier} from "../stringifier/default-stringifier.function";
import {SimpleLogger} from "../simple-logger.class";

export const createCombinedLogConsumer = (...consumers: LogConsumerAdapter[]): LogConsumerAdapter => {
    return (logger: SimpleLogger, stringifier = defaultStringifier) => {
        const cleanUps = consumers.map(consumer => consumer(logger, stringifier));
        return () => {
            cleanUps.forEach(cleanUp => cleanUp());
        }
    }
}