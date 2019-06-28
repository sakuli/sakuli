import {CommandModuleProvider} from "@sakuli/core";
import chalk from "chalk";
import {Argv, CommandModule} from "yargs";
import {secret} from "@nut-tree/secrets";
import {ENCRYPTION_KEY_VARIABLE} from "../context/common/secrets.function";

export const encryptCommand: CommandModuleProvider = (): CommandModule => {
    return ({
        command: 'encrypt [secret]',
        describe: `Encrypts a secret via provided masterkey`,
        builder(argv: Argv) {
            return argv.positional('secret', {
                describe: 'The secret to encrypt'
            }).option('masterkey', {
                describe: 'The masterkey used for encryption'
            }).demandOption('secret');
        },
        async handler(opts: any) {
            const key = opts.masterkey || process.env[ENCRYPTION_KEY_VARIABLE];
            if (!key) {
                console.log(chalk`{red.bold Missing master key.} Please export a master key to $${ENCRYPTION_KEY_VARIABLE} or provide it via --masterkey option`);
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
