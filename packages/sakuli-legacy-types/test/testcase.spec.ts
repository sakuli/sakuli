/**
 * This file does no actual test.
 * The actual test is to compile this file with the generated typings :)
 */

(async () => {
    const testCase: TestCase = new TestCase("My Typescript based test");
    try {
        await _navigateTo("https://sakuli.io");                                  // 1
        testCase.endOfStep("TS Open Landing Page",5);             // 2
        await _click(_link("Getting started"));                         // 3
        await _highlight(_code("npm init"));                            // 5
    } catch (e) {
        await testCase.handleException(e);
    } finally {
        await testCase.saveResult();
    }
})().then(done);
