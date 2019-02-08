import fetch from 'node-fetch';

export interface ConnectionInfo {
    port: number,
    host?: string,
}

export function waitForConnection({
                                      port,
                                      host = '127.0.0.1'
                                  }: ConnectionInfo, timeout: number = 10000) {
    return async () => {
        return new Promise((res, rej) => {
            const timeoutId = setTimeout(() => {
                clearInterval(interval);
                rej(Error(`Connection test timed out after ${timeout}ms`))
            }, timeout);
            const interval = setInterval(() => {
                fetch(`http://${host}:${port}`)
                    .then(
                        _ => {
                            clearInterval(interval);
                            clearTimeout(timeoutId);
                            res();
                        },
                        e => {

                        }
                    );
            }, 500);

        })
    }
}

