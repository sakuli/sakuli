import {Environment} from "./environment.class";

describe("Environment", () => {
    it("should have a default similarity value of 0.8", async () => {
        // GIVEN
        const SUT = new Environment();
        const expectedResult = 0.8;

        // WHEN

        // THEN
        expect(SUT.getSimilarity()).toEqual(expectedResult);
    });

    it("should not update similarity for value <= 0", async () => {
        // GIVEN
        const SUT = new Environment();
        const expectedResult = 0.8;

        // WHEN
        SUT.setSimilarity(-10);

        // THEN
        expect(SUT.getSimilarity()).toEqual(expectedResult);
    });

    it("should not update similarity for value == 0", async () => {
        // GIVEN
        const SUT = new Environment();
        const expectedResult = 0.8;

        // WHEN
        SUT.setSimilarity(0);

        // THEN
        expect(SUT.getSimilarity()).toEqual(expectedResult);
    });

    it("should not update similarity for values > 1", async () => {
        // GIVEN
        const SUT = new Environment();
        const expectedResult = 0.8;

        // WHEN
        SUT.setSimilarity(10);

        // THEN
        expect(SUT.getSimilarity()).toEqual(expectedResult);
    });

    it("should reset similarity to its default value", async () => {
        // GIVEN
        const SUT = new Environment();
        const expectedResult = 0.8;

        // WHEN
        SUT.setSimilarity(0.6);
        SUT.resetSimilarity();

        // THEN
        expect(SUT.getSimilarity()).toEqual(expectedResult);
    });

    it("sleep should pause execution for a given delay in seconds", async () => {
        // GIVEN
        const SUT = new Environment();
        const pauseInSeconds = 1;
        const expectedPauseInMilliseconds = 1000;
        const start = Date.now();

        // WHEN
        await SUT.sleep(pauseInSeconds);
        const stop = Date.now();

        // THEN
        expect(stop - start).toBeGreaterThanOrEqual(expectedPauseInMilliseconds);
    });

    it("sleep should pause execution for a given delay in ms", async () => {
        // GIVEN
        const SUT = new Environment();
        const expectedPause = 200;
        const start = Date.now();

        // WHEN
        await SUT.sleepMs(expectedPause);
        const stop = Date.now();

        // THEN
        expect(stop - start).toBeGreaterThanOrEqual(expectedPause);
    });
});