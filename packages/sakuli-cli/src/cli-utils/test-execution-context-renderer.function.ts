import {
    TestContextEntity,
    TestContextEntityStates,
    TestExecutionContext} from "@sakuli/core";
import {Ora} from 'ora';
import {ifPresent, Maybe} from "@sakuli/commons";
import ora from 'ora';

const ensure = <T>(otherwiseValue: T) => (maybeValue: Maybe<T>) => ifPresent(maybeValue, x => x, () => otherwiseValue);
const ensureName = ensure('UNNAMED');

const updateSpinner = (entities: TestContextEntity[], spinners: Ora[], indent: number = 0) => {
    for (let i = spinners.length; i < entities.length; i++) {
        const entity = entities[i];
        const spinner = ora({
            text: ensureName(entity.id),
            indent: indent
        }).start();
        spinners.push(spinner);
    }
    spinners.forEach((spinner, i) => {
        const entity = entities[i];
        const name = ensureName(entity.id);
        if(entity.isFinished() && spinner.isSpinning) {
            switch (entity.state) {
                case TestContextEntityStates.ERROR:
                    spinner.fail(ifPresent(entity.error, e => `${name}: ${e.message}`, () => `${name}: Error`));
                    break;
                case TestContextEntityStates.CRITICAL:
                    spinner.fail(`${name}: Exceeded critical time`);
                    break;
                case TestContextEntityStates.WARNING:
                    spinner.warn(`${name}: Exceeded warning time`);
                    break;
                default:
                    spinner.succeed(name)
            }
        }
    })
};

export const testExecutionContextRenderer = (ctx: TestExecutionContext) => new Promise(res => {

    const spinners: Record<string, Ora[]> = {
        suites: [],
        cases: [],
        steps: []
    };
    ctx.onChange(c => {
        updateSpinner(c.testSteps, spinners.steps, 2);
        updateSpinner(c.testCases, spinners.cases, 1);
        updateSpinner(c.testSuites, spinners.suites, 0);
        if(c.isExecutionFinished()) {
            res();
        }
    })
});
