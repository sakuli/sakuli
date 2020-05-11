import { promises as fs } from "fs";

export async function ensurePath(path: string) {
  try {
    await fs.access(path);
  } catch (e) {
    await fs.mkdir(path, { recursive: true });
  }
}
