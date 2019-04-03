import fs from 'fs';
import { readFileSync } from './fs-mocks';


export function createInMemoryFs(): typeof fs {
    return ({
        ...fs,
        readFileSync
    })
}