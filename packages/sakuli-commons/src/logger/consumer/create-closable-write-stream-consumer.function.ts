import { SimpleLogger } from "../simple-logger.class";
import { defaultStringifier } from "../stringifier";
import { LogConsumerAdapter } from "../log-consumer-adapter.interface";
import WriteStream = NodeJS.WritableStream;

export function createClosableWriteStreamConsumer(
  stream: WriteStream
): LogConsumerAdapter {
  return (logger: SimpleLogger, stringifier = defaultStringifier) => {
    let streamIsOpen = true;
    logger.onEvent((logEvent) => {
      if (streamIsOpen) {
        stream.write(stringifier(logEvent));
      }
    });
    return () => (streamIsOpen = false);
  };
}
