(async () => {
    const testCase = new TestCase('check _count works as expected');
    const url = 'https://www.heise.de/developer/meldung/Codeformatierung-Prettier-2-0-moechte-JavaScript-Code-verschoenern-4687961.html';
    try {
        await _navigateTo(url);
        await _wait(1500);
        const acceptButton = _button('Akzeptieren');
        if (await _isVisible(acceptButton)) {
            await _click(acceptButton);
        }
        const breadcrumbXPath = '//a[contains(@class,"a-breadcrumb__link")]';
        await _wait(5000, () => _isVisible(_byXPath(breadcrumbXPath)));
        await _highlight(_byXPath(breadcrumbXPath));
        const workaroundScript = `
        // in dev tools in FF/Chrome (in JS Console):
        // > $x('count(//a[contains(@class,"a-breadcrumb__link")])')
        // the command returns 3 as there are 3 breadcrumb links on the page
        return ((xpathWrappedInCount) => {
            const result = document.evaluate(
                xpathWrappedInCount,
                document,
                null,
                XPathResult.NUMBER_TYPE,
                null,
            );
        return (result || {}).numberValue;
        })('count(${breadcrumbXPath})');
        `;
        const breadcrumbsCount1 = await _eval(workaroundScript);
        await _assertEqual(3, breadcrumbsCount1);
        Logger.logInfo(`_eval script found ${breadcrumbsCount1} breadcrumbs`);
        const breadcrumbsCount2 = await _count('_byXPath', breadcrumbXPath);
        Logger.logInfo(`_count found ${breadcrumbsCount2} breadcrumbs`);
        await _assertEqual(3, breadcrumbsCount2);
        await testCase.endOfStep('test _count');
    } catch (e) {
        await testCase.handleException(e);
    } finally {
        await testCase.saveResult();
    }
})();
