import {ThenableWebDriver} from "selenium-webdriver";
import {webDriverHelper} from "./webdriver-helper.fuction";
import {createStaticServer, StaticServer} from "./serve-static-helper.function";
import {join} from "path";

export interface TestEnvInfo {
    webDriver: ThenableWebDriver,
    url: string,
    server: StaticServer
    tearDown: () => Promise<void>
}

export function initTestEnv(cb: (info: TestEnvInfo) => void) {

    const webDriver = webDriverHelper();
    const server = createStaticServer({
        path: join(__dirname, 'html')
    });
    return async (done: jest.DoneCallback) => {
        const url = await server.start();

        cb({
            webDriver,
            url,
            server,
            tearDown: async () => {
                await stopTestEnv({webDriver, server});
            }
        });
        done();
    }
}

export async function stopTestEnv({webDriver, server}: { webDriver: ThenableWebDriver, server: StaticServer }) {
    await webDriver.quit(); console.log('stopped webdriver');
    await server.stop(); console.log('stopped server');
}