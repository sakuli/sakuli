import { readFileSync } from 'fs';
import {server} from './native-http';

const x: number = 5;

console.log(
    readFileSync(''),
    x,
    server
);