(async () => {
    const testCase = new TestCase();
    try {
        await _navigateTo("https://try.gogs.io/");
        testCase.endOfStep("Open Gogs Landing Page", 5, 10);
        //await _click(_link("Sign In"));
// await _click(_textbox("user_name"));
        await _setValue(_textbox("user_name"), "gogs");
        await _setValue(_password("password"), "gogs");
        await _click(_submit("Sign In"));
        testCase.endOfStep("Login", 5, 10);
    } catch (e) {
        await testCase.handleException(e);
    } finally {
        await testCase.saveResult();
    }
})().then(done);

/*
(async () => {
    const testCase = new TestCase("Case 1");
    const env = new Environment();
    const mills = 200;
    try {
        await _navigateTo("https://www.lotto.de/lotto-6aus49"); // 1
        await testCase.endOfStep("Open Lotto Page"); // 2
        if (await _isVisible(_div("ppms_cm_popup_wrapper"))) {
            await _focus(_button("ppms_cm_agree-to-all"));
            await _highlight(_div("ppms_cm_popup_wrapper"));
            await _highlight(_div("ppms_cm_centered_buttons"));
            await _highlight(_button("ppms_cm_agree-to-all"));
            await testCase.endOfStep("Popup-Handle");
        } else {
            await testCase.endOfStep("No popup found!");
        }
        await _wait(4000);


        await _wait(3000);
    } catch (e) {
        await testCase.handleException(e);
    } finally {
        await testCase.saveResult();
    }
})().then(done);
*/
