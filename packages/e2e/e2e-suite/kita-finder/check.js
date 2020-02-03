const searchData = {
    searchDate: "01.05.2020",
    birthDate: "01.02.2020",
    location: "Agnes-Pockels-Bogen 21, 80992 München"
};

(async () => {
    const testCase = new TestCase("kitafinder");

    try {
        await _navigateTo("https://kitafinder.muenchen.de/elternportal/de/");
        await testCase.endOfStep("navigate to site");

        await _highlight(_heading1("Jetzt Ihren Kita-Platz suchen!"));
        await _assert(_isVisible(_heading1("Jetzt Ihren Kita-Platz suchen!")));
        await testCase.endOfStep("Seite prüfen");

        await fillSearchData(searchData);
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

async function fillSearchData(data) {
    await _setValue(_textbox("date-input-0"), data.searchDate);
    await _setValue(_textbox("date-input-1"), data.birthDate);
    await _setValue(_textbox("location-input-0"), data.location);
}