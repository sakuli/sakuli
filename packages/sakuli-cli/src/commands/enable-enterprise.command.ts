import { Argv, CommandModule } from "yargs";
import inquirer from "inquirer";
import { EnterpriseAnswers, hasLicense, } from "./enable-enterprise/enterprise-answers.interface";
import { AllFeatureChoices } from "./enable-enterprise/feature-choices.const";
import { getBootstrapTasks } from "./enable-enterprise/get-bootstrap-tasks.function";

export = <CommandModule>{
  command: "enable-enterprise",
  describe: "Configures and enables enterprise features",
  builder(argv: Argv) {
    return argv;
  },
  async handler() {
    const trim = (s: string) => s.trim();
    const answer = await inquirer.prompt<EnterpriseAnswers>([
      {
        type: "confirm",
        name: "hasLicense",
        message: "Would you like to enter your Sakuli license information?",
      },
      {
        name: "licenseKey",
        message: "Please enter your license key:",
        when: hasLicense,
        filter: trim,
      },
      {
        name: "npmKey",
        message: "Please enter your npm key:",
        when: hasLicense,
        filter: trim,
      },
      {
        type: "checkbox",
        name: "features",
        message: "Please Select Enterprise Features to bootstrap",
        choices: AllFeatureChoices,
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
