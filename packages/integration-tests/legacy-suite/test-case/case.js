(async () => {
    const tc = new TestCase();
    try {
        tc.endOfStep('Init');
        await _navigateTo('https://consol.github.io/sakuli/');
        await _wait(3000);
        // throw Error('something went wrong :(');
        tc.endOfStep('Load Page and wait');
        const htmlLink = await _link('HTML');
        await _highlight(htmlLink);
        await _click(htmlLink);
        tc.endOfStep('Open Documentation');
    }
    catch (e) {
        await _wait(3000);
        tc.handleException(e)
    } finally {
        tc.saveResult();
    }
})().then(done);
