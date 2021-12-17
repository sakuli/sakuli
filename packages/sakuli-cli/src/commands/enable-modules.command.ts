import { Argv, CommandModule } from "yargs";
import inquirer from "inquirer";
import { ModuleAnswers } from "./enable-features/module-answers.interface";
import { AllModuleChoices } from "./enable-features/module-choices.const";
import { getBootstrapTasks } from "./enable-features/get-bootstrap-tasks.function";

export = <CommandModule>{
  command: "enable-modules",
  describe: "Configures and enables modules",
  builder(argv: Argv) {
    return argv;
  },
  async handler() {
    const answer = await inquirer.prompt<ModuleAnswers>([
      {
        type: "checkbox",
        name: "features",
        message: "Please select the modules to bootstrap",
        choices: AllModuleChoices,
      },
    ]);

    const tasks = getBootstrapTasks(answer);
    try {
      for (let task of tasks) {
        await task();
      }
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  },
};
