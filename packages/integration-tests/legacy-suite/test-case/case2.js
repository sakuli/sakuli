(async () => {
  const testCase = new TestCase();
  const url = "https://sakuli.io";
  try {
    await _navigateTo(url + "/enterprise");
    await testCase.endOfStep("Opened Enterprise page.");
    await _click(_link(/Settings/, _in(_div("cookie-notice "))));
    await _click(_button("Accept selected"));
    await testCase.endOfStep("Accept essential cookies");
    await _highlight(_select("powermail_field_salutation"));
    await _setSelected(_select("powermail_field_salutation"), "Mrs.");
    await testCase.endOfStep("Set salutation");
    await _highlight(_checkbox("powermail_field_datenschutz_1"));
    await _check(_checkbox("powermail_field_datenschutz_1"));
    await testCase.endOfStep("Accept privacy policy");
  } catch (e) {
    await testCase.handleException(e);
  } finally {
    await testCase.saveResult();
  }
})();
