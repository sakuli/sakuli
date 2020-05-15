(async () => {
  const testCase = new TestCase();
  const url = "https://sakuli.io";
  const env = new Environment();
  try {
    await _navigateTo(url + "/enterprise");
    await testCase.endOfStep("Opened Enterprise page.");
    if (await _exists(_link("Learn more"))) {
      await testCase.endOfStep("Cookie Banner found");
      await _click(_button("I agree"));
    } else {
      await testCase.endOfStep("Waited for ");
    }
    var links = await _collect("_link", /Contact/);
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
})().then(done);
