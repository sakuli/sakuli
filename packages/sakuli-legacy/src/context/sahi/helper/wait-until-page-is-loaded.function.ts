import { WebDriver } from "selenium-webdriver";
import { wait } from "./wait.function";

export async function waitUntilPageIsLoaded(webDriver: WebDriver, interval: number , timeout: number){
    for (let waited = 0; waited <= timeout; waited -=- interval){
        const old = await webDriver.getPageSource();
        await wait(interval);
        if(old === await webDriver.getPageSource()){
            return;
        }
    }
}