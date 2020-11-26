import fetch from "node-fetch";

export interface ConnectionInfo {
  port: number;
  host?: string;
}

export function waitForConnection(
  { port, host = "127.0.0.1" }: ConnectionInfo,
  timeout: number = 15_000
) {
  return async () => {
    return new Promise<void>((res, rej) => {
      const timeoutId = setTimeout(() => {
        clearInterval(interval);
        rej(
          new Error(
            `Connection test to ${host}:${port} timed out after ${timeout}ms`
          )
        );
      }, timeout);
      const interval = setInterval(() => {
        fetch(`http://${host}:${port}`).then(
          (_) => {
            clearInterval(interval);
            clearTimeout(timeoutId);
            res();
          },
          (e) => {
            //console.warn(`Could not connect to ${host}${port} retry in 500ms`)
          }
        );
      }, 500);
    });
  };
}
