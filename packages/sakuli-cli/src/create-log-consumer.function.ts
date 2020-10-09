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
  const path = join(properties.sakuliLogFolder, "sakuli.log");
  console.log(chalk`Writing logs to: {bold.gray ${path}}`);
  const fileLogConsumerAdapter = createFileLogConsumer({ path });
  
  let logConsumer: LogConsumerAdapter;
  if (properties?.getLogMode() === LogMode.CI) {
    logConsumer = createCombinedLogConsumer(
      fileLogConsumerAdapter,
      createCiLogConsumer()
    );
  } else {
    logConsumer = createCombinedLogConsumer(fileLogConsumerAdapter);
  }
  return logConsumer(logger);
}
