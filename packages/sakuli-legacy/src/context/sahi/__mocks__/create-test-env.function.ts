import { Builder, ThenableWebDriver } from "selenium-webdriver";
import { RunContainer } from "./run-container.function";

export interface TestEnvironment {
  start(): Promise<void>;

  getEnv(): Promise<{ driver: ThenableWebDriver }>;

  stop(): Promise<void>;
}

export const createTestEnv = (
  browser: "firefox" | "chrome" = "chrome",
  local: boolean = false
): TestEnvironment => {
  let wdc: RunContainer;
  let driver: ThenableWebDriver;

  const driverPackage = {
    firefox: {
      package: "geckodriver",
      server: process.env.FIREFOX_WD_URL,
    },
    chrome: {
      package: "chromedriver",
      server: process.env.CHROME_WD_URL,
    },
  }[browser];

  async function start() {
    console.log(
      `Starting ${browser}, local=${local} with url: ${driverPackage.server}`
    );
    if (local) {
      await import(driverPackage.package);
    }
    const builder = new Builder().forBrowser(browser);

    if (!local) {
      builder.usingServer(`${driverPackage.server}`);
    }
    driver = builder.build();
  }

  async function getEnv() {
    return {
      driver,
    };
  }

  async function stop() {
    if (driver) {
      await driver.close();
    }
    if (wdc) {
      await wdc.stop();
    }
    await new Promise((res) => setTimeout(res, 500));
  }

  return {
    start,
    getEnv,
    stop,
  };
};
