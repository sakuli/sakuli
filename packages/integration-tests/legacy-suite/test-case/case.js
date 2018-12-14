(async () => {
    const tc = new TestCase();
    try {
        tc.endOfStep('Step 1');
        tc.endOfStep('Step 2');
        await _navigateTo('https://consol.github.io/sakuli/');
        await _wait(5000);
        const htmlLink = await _link('HTML');
        await _highlight(htmlLink);
        await _click(htmlLink);
    }
    catch (e) {
        console.log('Catched:' ,e);
        tc.handleException(e)
    } finally {
        tc.saveResult();
    }
})().then(done);
