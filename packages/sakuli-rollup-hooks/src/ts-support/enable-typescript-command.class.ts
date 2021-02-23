import { Argv, CommandModule, CommandModuleProvider } from "@sakuli/core";
import execa from "execa";
import { createInterface } from "readline";
import { stripIndents } from "common-tags";
import { isAbsolute, join, resolve } from "path";
import { promises as fs } from "fs";
import chalk from "chalk";
import ora, { Ora } from "ora";
import { defaultTsConfig } from "./default-ts-config.const";
import { getInstalledPresets } from "./get-installed-presets.function";
import packageTypingMapping from "./package-typing-mapping.const";
import { EOL } from "os";
import { getSakuliVersion } from "./get-sakuli-version.function";
import { containsTypescript } from "./contains-typescript.function";

const userInput = async (question: string): Promise<string> => {
  const rl = createInterface(process.stdin, process.stdout);
  return new Promise<string>((res, rej) => {
    rl.question(question, (answer) => {
      res(answer);
      rl.close();
    });
  });
};

export const enableTypescriptCommand: CommandModuleProvider = (): CommandModule => {
  return {
    command: "enable-typescript [project]",
    describe: `Enables Typescript support for the provided project`,
    builder(argv: Argv): any {
      return argv
        .positional("project", {
          describe: "Path to the project, can be absolute or relative to $PWD",
        })
        .demandOption("project") as any;
    },
    async handler(opts: Record<string, unknown> & { $0: string; _: string[] }) {
      const project = `${opts["project"]}`;
      const baseDir = isAbsolute(project)
        ? project
        : resolve(process.cwd(), project);
      const presets = await getInstalledPresets(baseDir);
      const sakuliVersion = await getSakuliVersion(baseDir);
      const typingPackages: [string, string][] = presets
        .filter((preset) => packageTypingMapping.has(preset))
        .map((preset) => [packageTypingMapping.get(preset)!, sakuliVersion]);

      if (!(await containsTypescript(baseDir))) {
        const tsVersion =
          require(join(__dirname, "..", "..", "package.json")).devDependencies
            .typescript || "4.1.3";
        typingPackages.unshift(["typescript", tsVersion]);
      }

      const answer = await userInput(stripIndents`
                This command will install and configure all relevant packages to use ${chalk.bold.blueBright(
                  "Typescript"
                )} in your project:
                ${typingPackages
                  .map(([pkg]) => `  - Install ${chalk.green(pkg)}`)
                  .join(EOL)}
                  - Create ${chalk.green("tsconfig.json")} in ${chalk.gray(
        baseDir
      )}

                Would you like to proceed [${chalk.green("Y")}/${chalk.red(
        "n"
      )}]: ${chalk.gray("default: Y")}
            `);
      if (answer.toLowerCase() !== "n") {
        const installs: [
          [string, string],
          Ora
        ][] = typingPackages.map((pkg) => [
          pkg,
          ora(`Running npm install ${pkg[0]}@${pkg[1]}`),
        ]);
        const createFile = ora("Creating tsconfig.json");
        for (let [pkg, install] of installs) {
          try {
            install.start();
            await execa("npm", ["i", `${pkg[0]}@${pkg[1]}`], { cwd: baseDir });
            install.succeed();
          } catch (e) {
            install.fail(e.message);
          }
        }
        try {
          createFile.start();
          const cfg = { ...defaultTsConfig };
          (cfg.compilerOptions.types as string[]).push(
            ...typingPackages.map((pkg) => pkg[0])
          );
          await fs.writeFile(
            join(baseDir, "tsconfig.json"),
            JSON.stringify(cfg, null, 2),
            { flag: "w" }
          );
          createFile.succeed();
        } catch (e) {
          createFile.fail(e.message);
          console.error(chalk.red(e));
          process.exit(1);
        }
        process.exit(0);
      } else {
        process.exit(-1);
      }
    },
  };
};
