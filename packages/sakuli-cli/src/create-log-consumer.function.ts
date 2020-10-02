import {
  createCiLogConsumer,
  createCombinedLogConsumer,
  createFileLogConsumer,
  LogConsumerAdapter,
  SimpleLogger,
} from "@sakuli/commons";
import { SakuliCoreProperties } from "@sakuli/core";
import { join } from "path";
import chalk from "chalk";
import { LogMode } from "@sakuli/core/dist/log-mode";

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
