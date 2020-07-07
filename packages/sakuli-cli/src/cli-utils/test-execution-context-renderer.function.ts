import {
  TestContextEntity,
  TestContextEntityState,
  TestExecutionContext,
} from "@sakuli/core";
import { ifPresent, Maybe } from "@sakuli/commons";
import chalk from "chalk";
import * as ansiEscapes from "ansi-escapes";

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

const stateNameMap: Record<TestContextEntityState, string> = {
  "0": chalk.green.bold("Ok"),
  "1": chalk.yellow.bold("Warning"),
  "2": chalk.red.bold("Critical"),
  "3": chalk.grey.bold("Unknown"),
  "4": chalk.red.bold("Error"),
};

const stateNameMapLog: Record<TestContextEntityState, string> = {
  "0": "Ok",
  "1": "Warning",
  "2": "Critical",
  "3": "Unknown",
  "4": "Error",
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
  const state = stateNameMap[e.state].length
    ? `with state ${stateNameMap[e.state]}`
    : ``;
  const prefix = `${indentString}${stateSign} Finished ${name} ${chalk.blue.bold(
    ensureName(e.id)
  )} ${state}`;
  const suffix = `${e.duration}${chalk.grey("s")}`;
  return padBetween(prefix, suffix, 180, chalk.grey("."));
};

const logEntityOnEnd = (e: TestContextEntity, name: string) => {
  const state = stateNameMap[e.state].length
    ? `with state ${stateNameMapLog[e.state]}`
    : ``;
  return `Finished ${name} ${ensureName(e.id)} ${state} ${e.duration}`;
};

const logEntityOnStart = (e: TestContextEntity, name: string) => {
  return `Started ${name} ${ensureName(e.id)}`;
};

export const testExecutionContextRenderer = (ctx: TestExecutionContext) =>
  new Promise((res) => {
    const l = console.log.bind(console);

    ctx
      .on("START_EXECUTION", (_) => {
        l(`Started execution`);
        ctx.logger.info("Started execution");
      })
      .on("START_TESTSUITE", (s) => {
        l(renderEntityOnStart(s, "Testsuite"));
        ctx.logger.info(logEntityOnStart(s, "Testsuite"));
      })
      .on("START_TESTCASE", (s) => {
        l(renderEntityOnStart(s, "Testcase", 2));
        ctx.logger.info(logEntityOnStart(s, "Testcase"));
      })
      .on("START_TESTSTEP", (s) => l(renderEntityOnStart(s, "Step", 3)))
      .on("END_TESTSTEP", (s) => {
        l(
          ansiEscapes.cursorUp(1) +
            ansiEscapes.eraseLine +
            renderEntityOnEnd(s, "Step", 3)
        );
        ctx.logger.info(logEntityOnEnd(s, "Step"));
      })
      .on("END_TESTCASE", (s) => {
        l(renderEntityOnEnd(s, "Testcase", 2));
        ctx.logger.info(logEntityOnEnd(s, "Testcase"));
      })
      .on("END_TESTSUITE", (s) => {
        l(renderEntityOnEnd(s, "Testsuite"));
        ctx.logger.info(logEntityOnEnd(s, "Testsuite"));
      })
      .on("END_EXECUTION", (_) => {
        l(`End execution`);
        ctx.logger.info("End execution");
        res();
      });
  });
