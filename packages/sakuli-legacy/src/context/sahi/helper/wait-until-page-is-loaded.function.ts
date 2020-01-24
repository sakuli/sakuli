import { WebDriver } from "selenium-webdriver";
import { wait } from "./wait.function";
import { TestExecutionContext } from "@sakuli/core";

export async function waitUntilPageIsLoaded(webDriver: WebDriver,
                                            interval: number,
                                            timeout: number,
                                            ctx: TestExecutionContext){
    ctx.logger.debug("Starting to wait until page is loaded");
    let oldDom = await webDriver.getPageSource();
    for (let waited = 0; waited < timeout; waited += interval){
        await wait(interval);
        const newDom = await webDriver.getPageSource();
        if(oldDom === newDom){
            ctx.logger.debug(`Finished page loading after ${waited}ms`);
            return;
        }
        oldDom = newDom;
        ctx.logger.debug(`Page has not finished loading after a timeout of ${timeout}ms. Continuing test execution`);
    }
}