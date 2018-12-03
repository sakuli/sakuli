import fs, { PathLike } from 'fs';
import {sep} from 'path'
import { throwIfAbsent, Maybe } from '../maybe';
import { readFileSync } from './fs-mocks';


export function createInMemoryFs(): typeof fs {
    return ({
        ...fs,
        readFileSync
    })
}