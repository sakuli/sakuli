import express from 'express';
import {Server} from "http";

export interface ServeStaticOptions {
    path?: string,
    port?: number
    hostname?: string,
}

export interface StaticServer {
    start(): Promise<string>;
    stop(): Promise<any>;
    server: Server | null
}

export function createStaticServer({
                                path = '.',
                                port = 1234,
                                hostname = 'localhost'
                            }: ServeStaticOptions): StaticServer  {
    const app = express();
    app.use(express.static(path));

    return ({
        server: null as Server | null,
        async start(_port?: number, _hostname?: string) {
            return new Promise<string>((res, rej) => {
                this.server = app.listen(0, hostname, () => {
                    if(this.server) {
                        const addressInfo = this.server.address();
                        res(typeof addressInfo === 'string'
                            ? addressInfo
                            : `http://${addressInfo.address}:${addressInfo.port}`
                        )
                    } else {
                        console.log('no server');
                    }
                });
            })
        },
        async stop() {
            if(this.server) {
                return Promise.resolve(this.server.close());
            }
            return Promise.resolve();
        }
    })
}