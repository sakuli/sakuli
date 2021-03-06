(async () => {
  const testCase = new TestCase("Fry a typed egg");
  const url = "https://sakuli.io/e2e-pages/fryed-egg";
  const screen = new Region();
  const env = new Environment();
  try {
    await _navigateTo(url);
    await testCase.endOfStep("Navigate to sakuli website");
    await _wait(100);
    await testCase.startStep("Search egg");
    const header = await _wait(2000, () =>
      _fetch(_heading1(/LET'S FRY AN EGG/))
    );
    await _highlight(header, 2000);
    await screen.find("background_color.png").click();
    await env.setSimilarity(0.95);
    await screen
      .find("source_egg.png")
      .highlight(1)
      .mouseMove()
      .mouseDown(MouseButton.LEFT);
    await testCase.startStep("Drop egg");
    await env.setSimilarity(0.6);
    await screen
      .find("target_pan.png")
      .highlight(1)
      .mouseMove()
      .mouseUp(MouseButton.LEFT);
    await testCase.endOfStep("Drop egg");
    await testCase.startStep("Check result");
    await new Region(0, 0, 10, 10).highlight(1).mouseMove();
    await screen.waitForImage("result.png", 5).highlight(1);
  } catch (e) {
    await testCase.handleException(e);
  } finally {
    await testCase.saveResult();
  }
})();
