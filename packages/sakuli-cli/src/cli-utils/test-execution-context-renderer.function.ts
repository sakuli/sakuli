import {
  SakuliCoreProperties,
  TestContextEntity,
  TestContextEntityState,
  TestExecutionContext,
} from "@sakuli/core";
import { ifPresent, Maybe } from "@sakuli/commons";
import chalk from "chalk";

const ensure = <T>(otherwiseValue: T) => (maybeValue: Maybe<T>) =>
  ifPresent(
    maybeValue,
    (x) => (x ? x : otherwiseValue),
    () => otherwiseValue
  );
const ensureName = ensure("UNNAMED");

const stateCharMap: Record<TestContextEntityState, string> = {
  "0": chalk.green.bold("✓"),
  "1": chalk.yellow.bold("⚠"),
  "2": chalk.red.bold("⚠"),
  "3": chalk.grey.bold("?"),
  "4": chalk.red.bold("⚠"),
};

const stateNameMapLog: Record<TestContextEntityState, string> = {
  "0": "Ok",
  "1": "Warning",
  "2": "Critical",
  "3": "Unknown",
  "4": "Error",
};

const stateNameMapConsole: Record<TestContextEntityState, string> = {
  "0": chalk.green.bold(stateNameMapLog["0"]),
  "1": chalk.yellow.bold(stateNameMapLog["1"]),
  "2": chalk.red.bold(stateNameMapLog["2"]),
  "3": chalk.grey.bold(stateNameMapLog["3"]),
  "4": chalk.red.bold(stateNameMapLog["4"]),
};

const repeatString = (length: number, char: string = " ") =>
  Array.from({ length }, () => char).reduce((a, b) => a + b, "");

const padBetween = (
  left: string,
  right: string,
  maxWidth: number = 200,
  filler: string = "."
) => {
  const len = left.length + right.length;
  const diff = maxWidth - len;
  return diff <= 0
    ? `${left}${filler}${right}`.substr(0, maxWidth)
    : `${left}${repeatString(diff, filler)}${right}`;
};

const renderEntityOnStart = (
  e: TestContextEntity,
  name: string,
  indent: number = 0
) => {
  const indentString = repeatString(indent);
  const sign = chalk.bold.blueBright("→");
  return `${indentString}${sign} Started ${name} ${chalk.blue.bold(
    ensureName(e.id)
  )}`;
};

const renderEntityOnEnd = (
  e: TestContextEntity,
  name: string,
  indent: number = 0
) => {
  const indentString = repeatString(indent);
  const stateSign = stateCharMap[e.state];
  const state = stateNameMapConsole[e.state].length
    ? `with state ${stateNameMapConsole[e.state]}`
    : ``;
  const prefix = `${indentString}${stateSign} Finished ${name} ${chalk.blue.bold(
    ensureName(e.id)
  )} ${state}`;
  const suffix = `${e.duration}${chalk.grey("s")}`;
  return padBetween(prefix, suffix, 180, chalk.grey("."));
};

export const entityOnEndLogMessage = (e: TestContextEntity, name: string) => {
  const state = stateNameMapLog[e.state].length
    ? `with state ${stateNameMapLog[e.state]}`
    : ``;
  return `Finished ${name} ${ensureName(e.id)} ${state} ${e.duration}s`;
};

export const entityOnStartLogMessage = (e: TestContextEntity, name: string) => {
  return `Started ${name} ${ensureName(e.id)}`;
};

export const testExecutionContextRenderer = (
  ctx: TestExecutionContext,
  properties: SakuliCoreProperties
) =>
  new Promise((res) => {
    function logToConsole(message: string) {
      if (!properties.logMode || properties.logMode === "logfile") {
        console.log(message);
      }
    }

    const logEntityOnStart = (
      s: TestContextEntity,
      name: string,
      indent: number = 0
    ) => {
      logToConsole(renderEntityOnStart(s, name, indent));
      ctx.logger.info(entityOnStartLogMessage(s, name));
    };
    const logEntityOnEnd = (
      s: TestContextEntity,
      name: string,
      indent: number = 0
    ) => {
      logToConsole(renderEntityOnEnd(s, name, indent));
      ctx.logger.info(entityOnEndLogMessage(s, name));
    };

    ctx
      .on("START_EXECUTION", (_) => {
        logToConsole(`Started execution`);
      })
      .on("START_TESTSUITE", (s) => {
        logEntityOnStart(s, "Testsuite");
      })
      .on("START_TESTCASE", (s) => {
        logEntityOnStart(s, "Testcase", 2);
      })
      .on("END_TESTSTEP", (s) => {
        logEntityOnEnd(s, "Step", 3);
      })
      .on("END_TESTCASE", (s) => {
        logEntityOnEnd(s, "Testcase", 2);
      })
      .on("END_TESTSUITE", (s) => {
        logEntityOnEnd(s, "Testsuite");
      })
      .on("END_EXECUTION", (_) => {
        logToConsole(`End execution`);
        res();
      });
  });
