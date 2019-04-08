(async () => {
    const tc = new TestCase();
    try {
        tc.endOfStep('Init');
        await _navigateTo('https://consol.github.io/sakuli/');
        tc.endOfStep('Load Page and wait');
        const htmlLink = _link('HTML');
        await _highlight(htmlLink);
        await _click(htmlLink);
        await _wait(3000);
        await(_highlight(_heading1(/Sakuli E2E testing and -monitoring/)));
        tc.endOfStep('Open Documentation');
    } catch (e) {
        tc.handleException(e);
    } finally {
        tc.saveResult();
    }
})().then(done);