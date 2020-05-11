(async () => {
  const testCase = new TestCase("kitafinder");

  try {
    await _navigateTo("https://kitafinder.muenchen.de/elternportal/de/");
    await testCase.endOfStep("navigate to site");

    await _highlight(_heading1("Jetzt Ihren Kita-Platz suchen!"));
    await _assert(_isVisible(_heading1("Jetzt Ihren Kita-Platz suchen!")));
    await testCase.endOfStep("Seite pruefen");

    await fillSearchData();
    await testCase.endOfStep("Fill data");

    await _highlight(_button("Suchen"));
    await _click(_button("Suchen"));
    await testCase.endOfStep("Search");

    await _highlight(_heading1(/\d* Einrichtungen gefunden/));
    await testCase.endOfStep("Verify");
  } catch (e) {
    await testCase.handleException(e);
  } finally {
    await testCase.saveResult();
  }
})();

async function fillSearchData() {
  const today = new Date();
  const birthDate = `${today.getDate()}.${today.getMonth() + 1}.${
    today.getFullYear() - 2
  }`;
  const searchDate = `${today.getDate()}.${
    today.getMonth() + 1
  }.${today.getFullYear()}`;
  const location = "Agnes-Pockels-Bogen 21, 80992 München";

  await _setValue(_textbox("date-input-0"), searchDate);
  await _setValue(_textbox("date-input-1"), birthDate);
  await _setValue(_textbox("location-input-0"), location);
}
