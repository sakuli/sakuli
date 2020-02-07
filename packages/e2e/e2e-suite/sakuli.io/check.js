(async () => {
    const testCase = new TestCase();
    const url = "https://sakuli.io";
    try {
        await _navigateTo(url + "/enterprise");
        await testCase.endOfStep("Opened Enterprise page.");

        const cookieBannerButton = _button("I agree");
        if (await _isVisible(cookieBannerButton)) {
            await _highlight(cookieBannerButton);
            await _click(cookieBannerButton);
        }
        await testCase.endOfStep("Close cookie banner");

        const links = await _collect("_link", /Contact/);
        await _highlight(links[1]);
        await _click(links[1]);
        await testCase.endOfStep("Contact form clicked.");
        await _assert(_isVisible(_heading1(/Contact our Team/)));
    } catch (e) {
        await testCase.handleException(e);
    } finally {
        await testCase.saveResult();
    }
})();
