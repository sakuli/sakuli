import {createConnection} from "net";

export async function isPortFree(port: number, host: string = '127.0.0.1') {
    return new Promise((res) => {
        const conn =  createConnection({port, host});
        conn.on('connect', ()=> res(false));
        conn.on('error', () => res(true));
        setTimeout(() => res(false), 3000);
    })
}


export async function findPort(min: number, max: number = 65535, host: string = '127.0.0.1') {
    for(let port = min; port <= max; port++) {
        if(await isPortFree(port, host)) {
            return port;
        }
    }
    throw Error(`Could not find any free port in range ${min} - ${max}`)
}