import {getReadableStateName, TestCaseContext, TestContextEntity, TestSuiteContext} from "@sakuli/core";
import chalk from "chalk";
import {renderArray} from "./render-array.function";
import {EOL} from "os";
import {Youch} from "youch";
import forTerminal from "youch-terminal";

export async function renderTestEntity(
    entity: TestContextEntity,
    tick: number = 0,
    ident: number = 0
) {
    const defaultName = '<UNKNOWN>';
    const identifier = `${entity.kind} ${entity.id || defaultName}`;
    const spinnerContent =  ['◜','◠','◝','◞','◡','◟'];
    const timeSinceStarted = entity.isStarted() ? (((new Date().getTime()) - (entity.startDate.getTime())) / 1000).toFixed(0) : '';
    const error = entity.error ? EOL + await new Youch(entity.error, {}).toJSON().then(forTerminal) : '';
    const color = chalk.bold.green;
    const main = !entity.isFinished()
        ? chalk`${spinnerContent[tick % spinnerContent.length]} {bold.yellow RUNNING} ${identifier} {gray for} ${timeSinceStarted.toString()}`
        : !!entity.error
            ? chalk`{bold.red ✗ ERROR} ${identifier} {gray after} ${(entity.duration || NaN).toString()}` + error
            : color(` ✓ ${getReadableStateName(entity.state)} `) + chalk`${identifier} {gray after} ${(entity.duration || NaN).toString()}`;
    let addition = '';
    if(entity instanceof TestSuiteContext) {
        addition = await renderArray(entity.testCases, tc => renderTestEntity(tc, tick, 1));
    }
    if(entity instanceof TestCaseContext) {
        addition = await renderArray(entity.testSteps, ts => renderTestEntity(ts, tick, 2));
    }
    return `${createIdent(ident)}${main}${EOL}${addition}`;
}

function createIdent(length: number, space: string = "  "): string {
    if(length > 0) {
        return space + createIdent(length -1, space);
    }
    return '';
}