(async () => {
    const testCase = new TestCase();
    try {
        await _navigateTo("https://sakuli.io");                  // 1
        testCase.endOfStep("Open Landing Page",5);                      // 2
        await _click(_link("Getting started"));                         // 3
        testCase.endOfStep("Navigate to Getting Started",3);            // 4
        await _highlight(_code("npm init"));                            // 5
        testCase.endOfStep("Find npm init code sample");
    } catch (e) {
        await testCase.handleException(e);
    } finally {
        await testCase.saveResult();
    }
})().then(done);
