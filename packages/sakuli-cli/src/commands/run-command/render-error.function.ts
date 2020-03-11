import chalk from "chalk";

export async function renderError(e: Error) {
    console.error(chalk.red(e.toString()));
    if (e.stack) {
        console.error(chalk.gray(e.stack.replace(e.toString(), '').trim()));
    }
}
