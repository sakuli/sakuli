import { SimpleLogger } from "./simple-logger.class";
import { LogEvent } from "./log-event.interface";

export type LogEventStringifier = (event: LogEvent) => string;
export type CleanUp = () => void;
export type LogConsumerAdapter = (
  logger: SimpleLogger,
  stringifier?: LogEventStringifier
) => CleanUp;
