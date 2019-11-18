import { join } from "path";
import { homedir } from "os";
import { promises as fs } from 'fs'

const npmRcContent = (key: string) => `//registry.npmjs.org/:_authToken=${key}`;

export const npmGlobalTask = (key: string) => async () => {
    const npmRcFile = join(homedir(), '.npmrc');
    await fs.writeFile(npmRcFile, npmRcContent(key), {flag: 'a'});

}
