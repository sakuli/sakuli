(async () => {
    const testCase = new TestCase("My Typescript based test");
    const env = new Environment();
    
    async function getControlKey() {
        return await env.isDarwin() ? Key.CMD : Key.CTRL;
    }
    try {
        await _navigateTo("https://sakuli.io");
        testCase.endOfStep("TS Open Landing Page");
        await _click(_link("EXPLORE"));
        testCase.endOfStep("TS Open Explore page");
        await _pageIsStable();
        await _click(_link("Docs"));
        testCase.endOfStep("TS Navigate to docs");
        await _wait( 5000, async () => (await driver.getAllWindowHandles()).length === 2);
        await driver.switchTo().window((await driver.getAllWindowHandles())[1]);
        await _highlight(_code("npm init"));
        testCase.endOfStep("Find npm init code sample");
        await env.type(Key.W, await getControlKey());
        await driver.switchTo().window((await driver.getAllWindowHandles())[0]);
        testCase.endOfStep("Close Tab");
    } catch (e) {
        await testCase.handleException(e);
    } finally {
        testCase.saveResult();
    }
})();