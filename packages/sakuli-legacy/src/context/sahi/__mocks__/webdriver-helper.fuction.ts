import {Builder} from "selenium-webdriver";
import chrome from 'selenium-webdriver/chrome';
import 'chromedriver';
import 'geckodriver';

export function webDriverHelper() {
    return new Builder().forBrowser('chrome')
        //.setChromeOptions(new chrome.Options().addArguments('--headless'))
        .build();
}