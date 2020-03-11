(async () => {
    const testCase: TestCase = new TestCase("My Typescript based test");
    try {
        await _navigateTo("https://sakuli.io");                                  // 1
        testCase.endOfStep("TS Open Landing Page");             // 2
        await _click(_link("Getting started"));                         // 3
        testCase.endOfStep("TS Navigate to Getting Started");   // 4
        await _highlight(_code("npm init"));                            // 5
        testCase.endOfStep("Find npm init code sample");
    } catch (e) {
        testCase.handleException(e);
    } finally {
        testCase.saveResult();
    }
})();