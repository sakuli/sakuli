import { WebDriver } from "selenium-webdriver";
import { wait } from "./wait.function";

export async function waitUntilPageIsLoaded(webDriver: WebDriver, interval: number , timeout: number){
    let oldDom = await webDriver.getPageSource();
    for (let waited = 0; waited < timeout; waited += interval){
        await wait(interval);
        const newDom = await webDriver.getPageSource();
        if(oldDom === newDom){
            return;
        }
        oldDom = newDom;
    }
}