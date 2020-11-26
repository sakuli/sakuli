import { CommandModuleProvider } from "@sakuli/core";
import chalk from "chalk";
import { Argv, CommandModule } from "yargs";
import { Algorithm, secret } from "@nut-tree/secrets";
import { parseMasterKey } from "../cryptic-commons/parse-master-key.function";

export const decryptCommand: CommandModuleProvider = (): CommandModule => {
  return {
    command: "decrypt [secret]",
    describe: `Decrypts a secret via provided masterkey`,
    builder(argv: Argv) {
      return argv
        .positional("secret", {
          describe: "The secret to decrypt",
        })
        .option("masterkey", {
          describe: "The masterkey used for decryption",
        })
        .demandOption("secret");
    },
    async handler(opts: any) {
      const masterKey = parseMasterKey(opts);
      if (!masterKey) {
        process.exit(-1);
      }
      try {
        const decrypted = await secret.decrypt(
          opts.secret,
          masterKey || "",
          Algorithm.AES128CBC
        );
        console.log(chalk`{green Decrypted secret:} ${decrypted}`);
        process.exit(0);
      } catch (e) {
        console.log(chalk`{red.bold An error occured}: ${e}`);
        process.exit(-1);
      }
    },
  };
};
