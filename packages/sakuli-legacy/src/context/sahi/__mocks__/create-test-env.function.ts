import {Builder, ThenableWebDriver} from "selenium-webdriver";
import {RunContainer, runContainer} from "./run-container.function";
import {waitForConnection} from "./wait-for-connection.function";
import {throwIfAbsent} from "@sakuli/commons";

export interface TestEnvironment {
    start(): Promise<void>;

    getEnv(): Promise<{ driver: ThenableWebDriver}>

    stop(): Promise<void>;
}

export function createTestEnv(browser: "firefox" | "chrome" = "chrome"): TestEnvironment {
    let wdc: RunContainer;

    async function start() {
        const [rc1, rc2] = await Promise.all([
            runContainer(`selenium/standalone-${browser}-debug`, {
                ports: [4444, 5900]
            }),

        ]);
        wdc = throwIfAbsent(rc1, Error('Could not init webdriver container'));
        await wdc.start();
        await waitForConnection({port: await wdc.getMappedPort(4444)})();
    }

    let driver: ThenableWebDriver;

    async function getEnv() {
        if (driver == null) {
            driver = new Builder()
                .forBrowser(browser)
                .usingServer(`http://localhost:${wdc.getMappedPort(4444)}/wd/hub`)
                .build();
        }
        return ({
            driver,
        })
    }

    async function stop() {
        if (driver) {
            await driver.close();
        }
        await Promise.all([
            wdc.stop()
        ])
    }

    return ({
        start,
        getEnv,
        stop
    })

}