(async () => {
    const testCase: TestCase = new TestCase("My Typescript based test");
    try {
        await _navigateTo("https://sakuli.io");
        testCase.endOfStep("TS Open Landing Page");
        await _click(_link("EXPLORE"));
        testCase.endOfStep("TS Open Explore page");
        await _click(_link("Docs"));
        testCase.endOfStep("TS Navigate to docs");
        await _wait( 5000, async () => (await driver.getAllWindowHandles()).length === 2);
        await driver.switchTo().window((await driver.getAllWindowHandles())[1]);
        await _highlight(_code("npm init"));
        testCase.endOfStep("Find npm init code sample");
    } catch (e) {
        testCase.handleException(e);
    } finally {
        testCase.saveResult();
    }
})();