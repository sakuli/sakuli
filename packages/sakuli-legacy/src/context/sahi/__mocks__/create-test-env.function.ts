import {Builder, ThenableWebDriver} from "selenium-webdriver";
import {join} from "path";
import {RunContainer, runContainer} from "./run-container.function";
import {waitForConnection} from "./wait-for-connection.function";
import {throwIfAbsent} from "@sakuli/commons";

export interface TestEnvironment {
    start(): Promise<void>;

    getEnv(): Promise<{ driver: ThenableWebDriver, url: string }>

    stop(): Promise<void>;
}

export function createTestEnv(): TestEnvironment {
    let wdc: RunContainer;
    let staticServer: RunContainer;

    async function start() {
        const [rc1, rc2] = await Promise.all([
            runContainer('selenium/standalone-chrome-debug', {
                ports: [4444, 5900]
            }),
            runContainer('httpd', {
                ports: [80],
                localMounts: [
                    [join(__dirname, 'html'), '/usr/local/apache2/htdocs/']
                ]
            })
        ]);
        wdc = throwIfAbsent(rc1, Error('Could not init webdriver container'));
        staticServer = throwIfAbsent(rc2, Error('Could not init webserver container'));
        await wdc.start();
        await staticServer.start();
        await waitForConnection({port: await wdc.getMappedPort(4444)})();
    }

    let driver: ThenableWebDriver;

    async function getEnv() {
        if (driver == null) {
            driver = new Builder()
                .forBrowser('chrome')
                .usingServer(`http://localhost:${wdc.getMappedPort(4444)}/wd/hub`)
                .build();
        }
        const ip = await staticServer.getIP();
        const port = staticServer.getMappedPort(80);
        return ({
            driver,
            url: `http://${ip}:${port}`
        })
    }

    async function stop() {
        if (driver) {
            await driver.close();
        }
        await Promise.all([
            staticServer.stop(),
            wdc.stop()
        ])
    }

    return ({
        start,
        getEnv,
        stop
    })

}