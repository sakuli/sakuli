import { LogConsumerAdapter } from "../log-consumer-adapter.interface";
import { SimpleLogger } from "../simple-logger.class";
import { defaultStringifier } from "../stringifier";

export const createCiLogConsumer = (): LogConsumerAdapter => {
  return (logger: SimpleLogger, stringifier = defaultStringifier) => {
    logger.onEvent((e) => {
      process.stdout.write(stringifier(e));
    });
    return () => {};
  };
};
