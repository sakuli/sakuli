import { promises as fs } from "fs";
import execa from 'execa';
import { join } from "path";
import { homedir } from "os";
import { Task } from ".";

const LicenseKeyEnv = (key:string) => `SAKULI_LICENSE_KEY=${key}`

/**
 * Task to set SAKULI_LICENSE_KEY env var on Windows systems
 * @param key
 */
const licenseGlobalWinTask = (key: string) => async () => {
    await execa('setx', [LicenseKeyEnv(key)]);
}

/**
 * Task to set SAKULI_LICENSE_KEY env var on *Nix systems and Mac
 * @param key
 */
const licenseGlobalNixTask = (key: string) => async () => {
    const bashRcFile = join(homedir(), '.bashrc');
    await fs.writeFile(bashRcFile, `\n${LicenseKeyEnv(key)}\n`, {flag: 'a'});
}

/**
 * Creates a task that sets the SAKULI_LICENSE_KEY on the specific platform
 * @param
 */
export const licenseGlobalTask = process.platform === 'win32'
    ? licenseGlobalWinTask
    : licenseGlobalNixTask
