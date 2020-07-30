(async () => {
  const testCase = new TestCase();
  try {
    await _navigateTo("https://sakuli.io");
    testCase.endOfStep("Open Landing Page", 100, 150);
    await _highlight(_link("TAKE ME TO THE DOCS AND GET STARTED"));
    await _click(_link("TAKE ME TO THE DOCS AND GET STARTED"));
    await _wait(1000);
    let handles = await driver.getAllWindowHandles();
    Logger.logInfo(`Window handles: ${handles}`);
    await driver.switchTo().window(handles[1]);
    testCase.endOfStep("Navigate to Getting Started", 30, 100);
    await _wait(5000);
    await _highlight(_code("npm init"));
    await driver.close();
    testCase.endOfStep("Find npm init code sample");
    await driver.switchTo().window(handles[0]);
    await _highlight(_link("Docs"));
    testCase.endOfStep("End");
  } catch (e) {
    await testCase.handleException(e);
  } finally {
    await testCase.saveResult();
  }
})();
