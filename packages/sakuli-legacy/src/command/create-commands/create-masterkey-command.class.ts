import { Algorithm, secret } from "@nut-tree/secrets";
import chalk from "chalk";
import { Argv } from "yargs";
import { stripIndents } from "common-tags";

interface CreateMasterKeyOptions {
  algorithm: Algorithm;
}

export = {
  command: "masterkey [algorithm]",
  describe: "Generates a new masterkey",
  builder(argv: Argv) {
    return argv
      .positional("algorithm", {
        describe: "The algorithm to create a key for",
        default: Algorithm.AES128CBC,
      })
      .demandOption("algorithm");
  },
  async handler(opts: CreateMasterKeyOptions) {
    const key = await secret.generateKey(opts.algorithm);
    console.log(
      stripIndents`${chalk`Create a Sakuli encryption master key (AES 128 bit):

        {green ${key}}

    ... now add this as environment var 'SAKULI_ENCRYPTION_KEY' or property 'sakuli.encryption.key'`}`
    );
    process.exit(0);
  },
};
