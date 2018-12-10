
const {Builder, Capabilities} = require('selenium-webdriver');
const browser = 'firefox';
/*
const capsProducer = throwIfAbsent(this.capabilityMap[browser], Error(`${browser} is not a valid browser`));
const caps = capsProducer();
*/
//const logPref = new logging.Preferences();
//logPref.setLevel(logging.Type.DRIVER, 'TRACE');
//caps.setLoggingPrefs(logPref);
const driver = new Builder()
    .forBrowser(browser)
    .withCapabilities(Capabilities.firefox())
    .build();

driver.get('https://consol.github.io/sakuli').then(_ => {
    console.log('Navigated');

    driver.quit();
});