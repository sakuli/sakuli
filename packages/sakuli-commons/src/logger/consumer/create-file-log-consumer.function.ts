import { LogConsumerAdapter } from "../log-consumer-adapter.interface";
import { SimpleLogger } from "../simple-logger.class";
import { defaultStringifier } from "../stringifier";
import { createWriteStream } from "fs";
import { createClosableWriteStreamConsumer } from "./create-closable-write-stream-consumer.function";

export interface FileLogConsumerOptions {
  path: string;
}

export const createFileLogConsumer = (
  options: FileLogConsumerOptions
): LogConsumerAdapter => {
  const fileStream = createWriteStream(options.path, {
    encoding: "UTF-8",
    flags: "a+",
  });
  return (logger: SimpleLogger, stringifier = defaultStringifier) => {
    const clean = createClosableWriteStreamConsumer(fileStream)(
      logger,
      stringifier
    );
    return () => {
      clean();
      fileStream.close();
    };
  };
};
