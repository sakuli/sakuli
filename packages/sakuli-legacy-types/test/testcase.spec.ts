/**
 * This file does no actual test.
 * The actual test is to compile this file with the generated typings :)
 */

(async () => {
    const testCase: TestCase = new TestCase("My Typescript based test");
    const screen = new Region();
    const chromium = new Application("chromium-browser");
    const env = new Environment();
    try {
        await _navigateTo("https://sakuli.io");                                  // 1
        testCase.endOfStep("TS Open Landing Page",5);             // 2
        await _click(_link("Getting started"));                         // 3
        await _highlight(_code("npm init"));                            // 5
        await screen.find("foo.png");
        await chromium.open();
        await env.type(Key.S);
        await env.typeMasked(Key.O);
        await screen.type(Key.Y);
        await screen.typeMasked(Key.A);
    } catch (e) {
        await testCase.handleException(e);
    } finally {
        await testCase.saveResult();
    }
})();
