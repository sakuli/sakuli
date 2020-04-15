(async () => {
    const testCase = new TestCase("My Typescript based test");
    try {
        await _navigateTo("https://sakuli.io/contact/");
        await _assertExists(_heading2("Get In Touch"));
        testCase.endOfStep("Open Contact Page");
        await _click(_link("Docs"));
        testCase.endOfStep("Navigate to docs");
        await _wait( 5000, async () => (await driver.getAllWindowHandles()).length === 2);
        await driver.switchTo().window((await driver.getAllWindowHandles())[1]);
        await _highlight(_code("npm init"));
        testCase.endOfStep("Find npm init code sample");
        await driver.close();
        await driver.switchTo().window((await driver.getAllWindowHandles())[0]);
        testCase.endOfStep("Close Tab");
    } catch (e) {
        await testCase.handleException(e);
    } finally {
        testCase.saveResult();
    }
})();