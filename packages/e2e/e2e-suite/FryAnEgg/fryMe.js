(async () => {
    const testCase = new TestCase("Fry an egg");
    const url = "https://codepen.io/naturalhanglider/full/jQMWoq";
    const screen = new Region();
    const env = new Environment();
    try {
        await _navigateTo(url);
        await _highlight(_heading1(/LET'S FRY AN EGG/),2000);
        await env.setSimilarity(0.95);
        await screen.find("source_egg.png").mouseMove().mouseDown(MouseButton.LEFT);
        await env.setSimilarity(0.60);
        await screen.find("target_pan.png").mouseMove().mouseUp(MouseButton.LEFT);
        await _wait(3000);
    } catch (e) {
        await testCase.handleException(e);
    } finally {
        await testCase.saveResult();
    }
})();
