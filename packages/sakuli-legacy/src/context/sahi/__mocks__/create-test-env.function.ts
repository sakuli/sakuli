import {Builder, ThenableWebDriver} from "selenium-webdriver";
import {RunContainer, runContainer} from "./run-container.function";
import {waitForConnection} from "./wait-for-connection.function";
import {throwIfAbsent} from "@sakuli/commons";

export interface TestEnvironment {
    start(): Promise<void>;

    getEnv(): Promise<{ driver: ThenableWebDriver }>

    stop(): Promise<void>;
}

export const createTestEnv = (browser: "firefox" | "chrome" = "chrome", local: boolean = false): TestEnvironment => {
    let wdc: RunContainer;
    let driver: ThenableWebDriver;

    const driverPackage = ({
        firefox: {
            package: 'geckodriver',
        },
        chrome: {
            package: 'chromedriver',
        }
    })[browser];

    async function start() {
        if (local) {
            await import(driverPackage.package);
            driver = new Builder()
                .forBrowser(browser)
                .build();
        } else {
            const rc1 = await runContainer(`selenium/standalone-${browser}-debug`, {
                ports: [4444, 5900]
            });
            wdc = throwIfAbsent(rc1, Error('Could not init webdriver container'));
            await wdc.start();
            await waitForConnection({port: await wdc.getMappedPort(4444)})();
        }
    }


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
        if (wdc) {
            await wdc.stop();
        }
        await new Promise(res => setTimeout(res, 500));
    }

    return ({
        start,
        getEnv,
        stop
    })

}