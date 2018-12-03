import {Maybe, throwIfAbsent} from '../maybe';
import { sep } from 'path';

export class InMemoryFile {    
    content: string = ''
}

type FsLayout = { [name: string]: string | FsLayout | InMemoryFile };

function isFsLayout(layout: string | InMemoryFile | FsLayout): layout is FsLayout {
    return typeof layout === 'object' && !(layout instanceof InMemoryFile);
}

const idx = (p: (string | number)[], o: any) => p.reduce((xs, x) => (xs && xs[x]) ? xs[x]: null, o);

export class MockFsLayout {
    constructor(
        readonly layout: FsLayout
    ) {}

    getFile(path: string): string {
        if(typeof path === 'string') {
            const dirs = path.split(sep);
            const f = idx(dirs, this.layout);
            const res: Maybe<string> = typeof f === "string"
                ? f
                : f instanceof InMemoryFile
                    ? f.content
                    : null
            return throwIfAbsent(res, Error('No such file ' + path))
        }
        throw Error('only string path are allowed')
    }

    getDir(path: string): string[] {
        const dirs = path.split(sep);
        const f = idx(dirs, this.layout);
        const res = typeof f === 'object'
            ? Object.keys(f)
            : null
            return throwIfAbsent(res, Error('No such directory ' + path))
    }
}
