import {vol, Volume} from 'memfs';
import {join} from "path";

const {patchFs} = require('fs-monkey');

interface FsLayout {
    [path: string]: LayoutNode;
}

type LayoutNode = string | FsLayout;

let layout: FsLayout;


export function flattenLayout(l: FsLayout): Record<string, string> {
    const first = Object.entries(l);
    return (function reduceLayout(entries: [string, LayoutNode][], parent: string, current: Record<string, string> = {}): Record<string, string> {
        return entries.reduce((c, [path, node]) => {
            const fullPath = join(parent, path);
            if (typeof node === "string") {
                return ({
                    ...c,
                    [fullPath]: node
                })
            } else {
                return ({
                    ...c,
                    ...reduceLayout(Object.entries(node), fullPath, c)
                })
            }
        }, current);
    })(first, '');
}

export function mockFs(_layout: FsLayout) {
    (process.env.MEMFS_DONT_WARN as any) = true;
    layout = _layout;

    vol.fromJSON(flattenLayout(_layout));
}

export function getVol() {
    return vol;
}