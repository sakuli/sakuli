import { TestExecutionContext } from "@sakuli/core/dist";
import { isPresent } from "@sakuli/commons/dist";
import { renderError } from "./render-error.function";
import chalk from "chalk";

export const renderErrorsFromContext = async (context: TestExecutionContext) => {
    const errors = context.entities.filter(e => isPresent(e.error));
    for (let errorEntity of errors) {
        const e = errorEntity.error;
        if (isPresent(e)) {
            console.log(chalk`\n{underline Failed to successfully finish {yellow ${errorEntity.kind}} {yellow.bold ${errorEntity.id || ''}}}:\n`);
            await renderError(e);
        }
    }
}
