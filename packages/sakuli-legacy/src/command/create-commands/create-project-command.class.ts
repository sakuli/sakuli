import { Argv } from "yargs";
import {
  createPackageJson,
  createTestcaseDirectory,
  createTestcaseFile,
  createTestsuiteDirectory,
  createTestsuiteProperties,
  createTestsuiteSuite,
} from "../../init-command/create-structure";
import chalk from "chalk";
import { existsSync, readdirSync } from "fs";

export = {
  command: "project [path] [suiteName]",
  describe: "Generates a default project structure",
  builder(argv: Argv) {
    return argv
      .positional("path", {
        describe: "Path to create testsuite",
        default: process.cwd(),
        type: "string",
      })
      .positional("suiteName", {
        describe: "Name of testsuite",
        default: "sakuli_test_suite",
        type: "string",
      })
      .option("force", {
        alias: "f",
        describe: "Forces sakuli to create testsuite",
        default: false,
        type: "boolean",
      })
      .option("package", {
        describe: "Create additional package.json for testsuite",
        default: false,
        type: "boolean",
      });
  },
  async handler(opts: any) {
    const testsuitePath = `${opts.path}/${opts.suiteName}`;
    try {
      if (
        existsSync(testsuitePath) &&
        readdirSync(testsuitePath).includes("testsuite.properties") &&
        !opts.force
      ) {
        console.log(
          chalk`{red ${testsuitePath} is already a sakuli testsuite. Use --force to overwrite the files.}`
        );
      } else {
        console.log(`Creating testsuite in ${opts.path}`);

        createTestsuiteDirectory(testsuitePath);
        console.log(`Created directory ${opts.suiteName}`);

        createTestsuiteProperties(testsuitePath, opts.suiteName);
        console.log(`Created file testsuite.properties`);

        createTestsuiteSuite(testsuitePath);
        console.log(`Created file testsuite.suite`);

        createTestcaseDirectory(testsuitePath);
        console.log(`Created directory /case1`);

        createTestcaseFile(testsuitePath);
        console.log("Created file /case1/check.js");

        if (opts.package) {
          createPackageJson(opts.path, opts.suiteName);
          console.log("Created file package.json");
        }
        console.log(
          chalk`{green.bold Successfully created testsuite in ${opts.path}}`
        );
      }
      process.exit(0);
    } catch (e) {
      console.log(chalk`{red.bold An error occured}: ${e}`);
      process.exit(-1);
    }
  },
};
