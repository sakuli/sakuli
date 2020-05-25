import execa from "execa";
import { isExistingDirectory } from "./is-existing-directory.function";

export const getNodeModulesPaths = async (): Promise<string[]> => {
  let nodeModulesPaths: string[] = [];
  let candidates: string[] = [];

  candidates.push(await getPackageNodeModules());
  candidates.push(await getGlobalNodeModules());

  for (const candidate of candidates) {
    if (isExistingDirectory(candidate)) {
      nodeModulesPaths.push(candidate);
    }
  }
  return nodeModulesPaths;
};

const getPackageNodeModules = async (): Promise<string> => {
  const { stdout } = await execa("npm", ["root"]);
  return stdout;
};

const getGlobalNodeModules = async (): Promise<string> => {
  const { stdout } = await execa("npm", ["root", "-g"]);
  return stdout;
};
