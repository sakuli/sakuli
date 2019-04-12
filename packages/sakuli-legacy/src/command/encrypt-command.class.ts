import {CommandModuleProvider} from "@sakuli/core";
import chalk from "chalk";
import {Argv, CommandModule} from "yargs";
import {secret} from "@nut-tree/secrets";
import {ENCRYPTION_KEY_VARIABLE} from "../context/common/secrets.function";

export const encryptCommand: CommandModuleProvider = (): CommandModule => {
    return ({
        command: 'encrypt [secret]',
        describe: `Encrypts a secret using $${ENCRYPTION_KEY_VARIABLE}`,
        builder(argv: Argv) {
            return argv.positional('secret', {
                describe: 'The secret to encrypt'
            }).demandOption('secret');
        },
        async handler(opts: any) {
            const key = process.env[ENCRYPTION_KEY_VARIABLE];
            if (!key) {
                console.log(chalk`{red.bold Missing master key.} Please export a master key to $${ENCRYPTION_KEY_VARIABLE}`);
                process.exit(-1)
            }
            try {
                const encrypted = await secret.encrypt(opts.secret, key || "");
                console.log(chalk`{green Encrypted secret:} ${encrypted}`);
                process.exit(0);
            } catch (e) {
                console.log(chalk`{red.bold An error occured}: ${e}`);
                process.exit(-1);
            }
        }
    });
};
