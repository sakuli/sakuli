import { PathLike, promises as fs } from "fs";

export const readJson = async <T = any>(path: PathLike): Promise<T> => {
  const jsonFile = (await fs.readFile(path)).toString("utf-8");
  return JSON.parse(jsonFile);
};
