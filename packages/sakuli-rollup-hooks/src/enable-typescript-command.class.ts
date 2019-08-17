import {CommandModuleProvider} from "@sakuli/core";
import execa from 'execa';
import {Argv, CommandModule} from "yargs";
import { createInterface } from "readline";
import {stripIndents} from 'common-tags'
import { resolve, isAbsolute, join } from "path";
import {promises as fs} from 'fs';
import chalk from 'chalk'
import ora from 'ora';

const userInput = async (question: string): Promise<string> => {
    const rl = createInterface(process.stdin,process.stdout);
    return new Promise<string>((res, rej) => {
        rl.question(question, answer => {
            res(answer);
            rl.close();
        });
    })
}

const tsConfig = {
    "compilerOptions": {
        "module": "commonjs",
        "target": "es2017",
        "noImplicitAny": true,
        "sourceMap": true,
        "lib": ["es2017"],
        "types": [
            "@sakuli/legacy-types"
        ]
    }
}

export const enableTypescriptCommand: CommandModuleProvider = (): CommandModule => {
    return ({
        command: 'enable-typescript [project]',
        describe: `Enables Typescript suppoprt for the provided project`,
        builder(argv: Argv) {
            return argv.positional('project', {
                describe: 'Path to the project relative to $PWD'
            }).demandOption('project');
        },
        async handler(opts: Record<string, unknown> & {$0: string, _: string[]}) {
            const project = `${opts['project']}`;
            const baseDir = isAbsolute(project) ? project : resolve(process.cwd(), project);
            const answer = await userInput(stripIndents`
                This command will install and configure all relevant packages to use ${chalk.bold.blueBright('Typescript')} in your project:

                  - Install ${chalk.green("@sakuli/legacy-types")}
                  - Create ${chalk.green('tsconfig.json')} in ${chalk.gray(baseDir)}

                Would you like to proceed [${chalk.green('Y')}/${chalk.red('n')}]:

            `);
            if(answer.toUpperCase() === 'Y') {
                const install = ora('Running npm i install @sakuli/legacy-types')
                const createFile = ora('Creating tsconfig.json')
                try {
                    install.start();
                    await execa('npm', ['i', '@sakuli/legacy-types']);
                    install.succeed()
                    createFile.start();
                    await fs.writeFile(
                        join(baseDir, 'tsconfig.json'),
                        JSON.stringify(tsConfig, null, 2),
                        {flag: 'w'}
                        );
                    createFile.succeed();
                } catch(e) {
                    install.fail();
                    createFile.fail();
                    console.error(chalk.red(e));
                    process.exit(1);
                }
            } else {
                process.exit(-1);
            }
        }
    });
};
