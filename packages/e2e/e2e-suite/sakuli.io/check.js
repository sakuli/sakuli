(async () => {
    const testCase = new TestCase();
    const url = "https://sakuli.io";
    try {
        await _navigateTo(url + "/enterprise");
        await testCase.endOfStep("Opened Enterprise page.");
        const links = await _collect("_link", /Contact/);
        await _focus(links[1]);
        await _highlight(links[1]);
        await _click(links[1]);
        await testCase.endOfStep("Contact form clicked.");
        await _wait(3000);
    } catch (e) {
        await testCase.handleException(e);
    } finally {
        await testCase.saveResult();
    }
})();
