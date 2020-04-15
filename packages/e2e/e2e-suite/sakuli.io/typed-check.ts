(async () => {
    const testCase: TestCase = new TestCase("My Typescript based test");
    const env = new Environment();

    async function getControlKey() {
        return await env.isDarwin() ? Key.CMD : Key.CTRL;
    }
    try {
        await _navigateTo("https://sakuli.io/contact/");
        await _assertExists(_heading2("Get In Touch"));
        testCase.endOfStep("TS Open Contact Page");
        await _click(_link("Docs"));
        testCase.endOfStep("TS Navigate to docs");
        await _wait( 5000, async () => (await driver.getAllWindowHandles()).length === 2);
        await driver.switchTo().window((await driver.getAllWindowHandles())[1]);
        await _highlight(_code("npm init"));
        testCase.endOfStep("TS Find npm init code sample");
        await env.type(Key.W, await getControlKey());
        await driver.switchTo().window((await driver.getAllWindowHandles())[0]);
        testCase.endOfStep("TS Close Tab");
    } catch (e) {
        await testCase.handleException(e);
    } finally {
        testCase.saveResult();
    }
})();