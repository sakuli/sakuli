import * as fs from 'fs';
import { promisify } from 'util';


export const readdir = promisify(fs.readdir);