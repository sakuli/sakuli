import {FsLayoutEntry} from "./fs-layout-entry.interface";

export interface File {
    /*
     * File contents.
     */
    content: string | Buffer;

}

export const FILE_SYMBOL = Symbol('fs-mock-file');

export const file = ({
                         content,
                         atime = new Date(),
                         birthtime = new Date(),
                         ctime = new Date(),
                         gid = process.getegid(),
                         mode = 0o666,
                         mtime = new Date(),
                         uid = process.getuid()
                     }: File & Partial<FsLayoutEntry>): File & FsLayoutEntry => ({
    content, atime, birthtime, ctime, gid, mode, mtime, uid, _type: FILE_SYMBOL
});

export function isFile(e: FsLayoutEntry): e is File & FsLayoutEntry {
    return e._type === FILE_SYMBOL;
}