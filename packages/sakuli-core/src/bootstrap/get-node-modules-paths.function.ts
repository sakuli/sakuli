import { join, resolve } from "path";
import execa from "execa";
import { isExistingDirectory } from "./is-existing-directory.function";

export const getNodeModulesPaths = async (
  path: string = "."
): Promise<string[]> => {
  let nodeModulesPaths: string[] = [];
  let previous: string;

  do {
    const modules = join(path, "node_modules/@sakuli");
    if (isExistingDirectory(modules)) {
      nodeModulesPaths.push(modules);
    }

    previous = path;
    path = resolve(join(previous, ".."));
  } while (previous !== path);

  let { stdout } = await execa("npm", ["root", "-g"]);
  if (isExistingDirectory(stdout)) {
    nodeModulesPaths.push(`${stdout}/@sakuli`);
  }
  return nodeModulesPaths;
};
