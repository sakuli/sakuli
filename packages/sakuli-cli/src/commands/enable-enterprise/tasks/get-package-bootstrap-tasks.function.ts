import { Task, oraTask, installPackageTask } from ".";
import chalk from "chalk";
import { join } from "path";
import { configureFeatureTask } from "./configure-feature-task.function";
import { registerPackageTask } from "./register-package-task.function";

export const getPackageBootstrapTasks = (
    npmPackageName: string,
    configurationItems: Record<string, string>
): Task[] => [
        oraTask(chalk`Installing {bold ${npmPackageName}}`, installPackageTask(npmPackageName)),
        oraTask(chalk`Bootstrapping configuration for {bold ${npmPackageName}}`, configureFeatureTask(configurationItems)),
        oraTask(chalk`Registering {bold ${npmPackageName}} in project`, registerPackageTask(npmPackageName))
    ]
