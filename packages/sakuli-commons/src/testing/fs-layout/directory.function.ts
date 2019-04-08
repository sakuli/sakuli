import {FsLayoutEntry} from "./fs-layout-entry.interface";

export interface Directory {
    /*
     * File contents.
     */
    items: FsLayoutEntry[];

}

export const DIRECTORY_SYMBOL = Symbol('fs-mock-directory');

export const directory = ({
                              items,
                              atime = new Date(),
                              birthtime = new Date(),
                              ctime = new Date(),
                              gid = process.getegid(),
                              mode = 0o666,
                              mtime = new Date(),
                              uid = process.getuid()
                          }: Directory & Partial<FsLayoutEntry>): Directory & FsLayoutEntry => ({
    items, atime, birthtime, ctime, gid, mode, mtime, uid, _type: DIRECTORY_SYMBOL
});

export function isDirectory(e: FsLayoutEntry): e is Directory & FsLayoutEntry {
    return e._type === DIRECTORY_SYMBOL;
}