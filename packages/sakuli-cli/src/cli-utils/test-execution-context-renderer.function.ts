import {TestExecutionContext} from "@sakuli/core";
import {Ora} from 'ora';
import {ifPresent, Maybe} from "@sakuli/commons";
import ora from 'ora';

interface SpinnerEntity {
    spinner: Ora;
    children: SpinnerEntity[]
}

const ensure = <T>(otherwiseValue: T) => (maybeValue: Maybe<T>) => ifPresent(maybeValue, x => x, () => otherwiseValue);

export const testExecutionContextRenderer = (ctx: TestExecutionContext) => {
    const spinners: SpinnerEntity[] = [];
    const ensureName = ensure('UNNAMED');
    ctx.onChange(c => {
        /*
        if (spinners.length < c.testSuites.length) { // add new suite
            ifPresent(c.getCurrentTestSuite(), suite => {
                spinners.push({
                    spinner: ora(suite.id || 'UNNAMED').start(),
                    children: suite.getChildren().map(c => ora(ensureName(suite.id)))
                })
            });
        }
         */

    })
};