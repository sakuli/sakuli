(async () => {
    const testCase = new TestCase("Fry an egg");
    const url = "https://sakuli.io/e2e-pages/fryed-egg";
    const screen = new Region();
    const env = new Environment();
    try {
        await _navigateTo(url);
        await _highlight(_heading1(/LET'S FRY AN EGG/), 2000);
        await env.setSimilarity(0.95);
        await screen.find("source_egg.png").mouseMove().mouseDown(MouseButton.LEFT);
        await testCase.endOfStep("Search egg");
        await env.setSimilarity(0.60);
        await screen.find("target_pan.png").mouseMove().mouseUp(MouseButton.LEFT);
        await testCase.endOfStep("Drop egg");
        await new Region(0, 0, 10, 10).mouseMove();
        await screen.waitForImage("result.png", 5);
        await testCase.endOfStep("Check result");
    } catch (e) {
        await testCase.handleException(e);
    } finally {
        await testCase.saveResult();
    }
})();
