import { PathLike } from "fs";
import {promises as fs} from 'fs';

export const readJson = async <T = any>(path: PathLike): Promise<T> => {
    const jsonFile = (await fs.readFile(path)).toString("UTF-8");
    return JSON.parse(jsonFile);
}
