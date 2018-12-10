(async () => {
    const tc = new TestCase();
    try {

        tc.endOfStep('Step 1');
        tc.endOfStep('Step 2');
        console.log('driver', await webDriver.getSession());
        await _navigateTo('https://consol.github.io/sakuli/');
        //await _wait(5000);
        const htmlLink = await _link('HTML');
        await _highlight(htmlLink);
        await _click(htmlLink);
    }
    catch (e) {
        tc.handleException(e)
    } finally {
        tc.saveResult();
    }
})();
