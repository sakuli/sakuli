(async () => {
    const testCase = new TestCase();
    const url = "https://sakuli.io";
    try {
        await _navigateTo(url + "/#enterprise");
        await _pageIsStable();
        await testCase.endOfStep("Navigate to enterprise section");

        const cookieBannerButton = _button("Accept all");
        if (await _isVisible(cookieBannerButton)) {
            await _highlight(cookieBannerButton);
            await _click(cookieBannerButton);
        }
        await testCase.endOfStep("Close cookie banner");

        await _click(_link("Request"));
        await _pageIsStable();
        await _assertEqual("M-Package", await _getSelectedText(_select("powermail_field_kundenwunsch")));
        await testCase.endOfStep("Contact form clicked");
    } catch (e) {
        await testCase.handleException(e);
    } finally {
        await testCase.saveResult();
    }
})();
