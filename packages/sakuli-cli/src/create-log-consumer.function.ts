import {
  createCiLogConsumer,
  createCombinedLogConsumer,
  createFileLogConsumer,
  LogConsumerAdapter,
  SimpleLogger,
} from "@sakuli/commons";
import { SakuliCoreProperties } from "@sakuli/core";

export function createLogConsumer(
  logger: SimpleLogger,
  path: string,
  properties: SakuliCoreProperties
) {
  let logConsumerAdapter: LogConsumerAdapter;
  if (properties?.logMode === "ci") {
    logConsumerAdapter = createCiLogConsumer();
  } else {
    logConsumerAdapter = createFileLogConsumer({ path });
  }
  const logConsumer = createCombinedLogConsumer(logConsumerAdapter);
  return logConsumer(logger);
}
