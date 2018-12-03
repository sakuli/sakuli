import { PathLike } from "fs";
import { sep } from "path";
import { Maybe, throwIfAbsent } from "..";

export class InMemoryFile {    
    content: string = ''
}

type FsLayout = { [name: string]: string | FsLayout | InMemoryFile };

let layout: FsLayout = {};

export function mockFsLayout(laoyut: FsLayout) {
    layout = layout;
}



export function restoreFsLayout() {
    layout = {};
}

function flatLayout(layout: FsLayout, root: string = ''): any {    
}

function isFsLayout(layout: string | InMemoryFile | FsLayout): layout is FsLayout {
    return typeof layout === 'object' && !(layout instanceof InMemoryFile);
}

const idx = (p: (string | number)[], o: any) => p.reduce((xs, x) => (xs && xs[x]) ? xs[x]: null, o);


export function readFileSync(path: PathLike | number, options?: { encoding?: null; flag?: string; } | null): Buffer;
export function readFileSync(path: PathLike | number, options: { encoding: string; flag?: string; } | string): string;
export function readFileSync(path: PathLike | number, options?: { encoding?: string | null; flag?: string; } | string | null): string | Buffer;
export function readFileSync(path: any, options: any | null): string | Buffer {
    if(typeof path === 'string') {
        const dirs = path.split(sep);
        const f = idx(dirs, layout);
        const res: Maybe<string> = typeof f === "string"
            ? f
            : f instanceof InMemoryFile
                ? f.content
                : null
        return throwIfAbsent(res, Error('No such file or directory ' + path))
    }
    throw Error('only string path are allowed')
}
