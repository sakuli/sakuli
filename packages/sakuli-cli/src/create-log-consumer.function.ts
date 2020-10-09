import {
  createCiLogConsumer,
  createCombinedLogConsumer,
  createFileLogConsumer,
  LogConsumerAdapter,
  SimpleLogger,
} from "@sakuli/commons";
import { SakuliCoreProperties, LogMode } from "@sakuli/core";
import { join } from "path";
import chalk from "chalk";

export function createLogConsumer(
  logger: SimpleLogger,
  properties: SakuliCoreProperties
) {
  let logConsumerAdapter: LogConsumerAdapter;
  if (properties?.getLogMode() === LogMode.CI) {
    logConsumerAdapter = createCiLogConsumer();
  } else {
    const path = join(properties.sakuliLogFolder, "sakuli.log");
    console.log(chalk`Writing logs to: {bold.gray ${path}}`);
    logConsumerAdapter = createFileLogConsumer({ path });
  }
  const logConsumer = createCombinedLogConsumer(logConsumerAdapter);
  return logConsumer(logger);
}
