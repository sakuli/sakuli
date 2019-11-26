import { Task, oraTask, installPackageTask, ConfigurationRecord } from ".";
import chalk from "chalk";
import { configureFeatureTask } from "./configure-feature-task.function";
import { registerPackageTask } from "./register-package-task.function";

/**
 * Creates a list of {@see oraTask} which can be used to bootstrap configuration and installation of a certain package.
 * @param npmPackageName
 * @param configurationItems
 */
export const getPackageBootstrapTasks = (
    npmPackageName: string,
    configurationItems: ConfigurationRecord
): Task[] => [
        oraTask(chalk`Installing {bold ${npmPackageName}}`, installPackageTask(npmPackageName)),
        oraTask(chalk`Bootstrapping configuration for {bold ${npmPackageName}}`, configureFeatureTask(configurationItems)),
        oraTask(chalk`Registering {bold ${npmPackageName}} in project`, registerPackageTask(npmPackageName))
    ]
