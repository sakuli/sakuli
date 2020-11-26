import { MASTERKEY_ENV_KEY } from "../context/common";
import chalk from "chalk";

export function parseMasterKey(opts: any) {
  const key = opts.masterkey || process.env[MASTERKEY_ENV_KEY];
  if (!key) {
    console.log(
      chalk`{red.bold Missing master key.} Please export a master key to $${MASTERKEY_ENV_KEY} or provide it via --masterkey option`
    );
    return undefined;
  }
  return key;
}
