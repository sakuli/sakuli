import { Task } from ".";
import ora from "ora";
import chalk from "chalk";

/**
 * Wraps a Task within a Task that visualize the execution of a that Task on CLI.
 * Shows a spinner on the left side of `title` while the actual Task is running.
 * The spinner is replaced by a checkmark or a cross when the task succeeds or fails respectively
 *
 * @param title - Displayed during task is running
 * @param task -
 */
export const oraTask = (title: string, task: Task): Task => {
  return async () => {
    const spinner = ora(title).start();
    try {
      await task();
      spinner.succeed();
    } catch (e: any) {
      spinner.fail(chalk`${title} \n{red ${e.message}}`);
    }
  };
};
