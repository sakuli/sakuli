import { existsSync, statSync } from "fs";

export function isExistingDirectory(path: string) {
  return existsSync(path) && statSync(path).isDirectory();
}
