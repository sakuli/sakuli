import {describe} from "selenium-webdriver/testing";
import {ENCRYPTION_KEY_VARIABLE} from "./secrets.function";
import {createEnvironmentClass} from "./sakuli-environment.class";
import {SimpleLogger} from "@sakuli/commons";
import {TestExecutionContext} from "@sakuli/core";

describe("Similarity ", () => {
    it("should have a default value of 0.99", async () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new EnvironmentImpl();
        const expectedResult = 0.99;

        // WHEN

        // THEN
        expect(SUT.getSimilarity()).toEqual(expectedResult);
    });

    it("should not update for value <= 0", async () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new EnvironmentImpl();
        const expectedResult = 0.99;

        // WHEN
        SUT.setSimilarity(-10);

        // THEN
        expect(SUT.getSimilarity()).toEqual(expectedResult);
    });

    it("should not update for value == 0", async () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new EnvironmentImpl();
        const expectedResult = 0.99;

        // WHEN
        SUT.setSimilarity(0);

        // THEN
        expect(SUT.getSimilarity()).toEqual(expectedResult);
    });

    it("should not update for values > 1", async () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new EnvironmentImpl();
        const expectedResult = 0.99;

        // WHEN
        SUT.setSimilarity(10);

        // THEN
        expect(SUT.getSimilarity()).toEqual(expectedResult);
    });

    it("should reset to its default value", async () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new EnvironmentImpl();
        const expectedResult = 0.99;

        // WHEN
        SUT.setSimilarity(0.6);
        SUT.resetSimilarity();

        // THEN
        expect(SUT.getSimilarity()).toEqual(expectedResult);
    });
});

describe("sleep", () => {
    it("should pause execution for a given delay in seconds", async () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new EnvironmentImpl();
        const pauseInSeconds = 1;
        const expectedPauseInMilliseconds = 1000;
        const start = Date.now();

        // WHEN
        await SUT.sleep(pauseInSeconds);
        const stop = Date.now();

        // THEN
        expect(stop - start).toBeGreaterThanOrEqual(expectedPauseInMilliseconds);
    });

    it("should pause execution for a given delay in ms", async () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new EnvironmentImpl();
        const expectedPause = 200;
        const start = Date.now();

        // WHEN
        await SUT.sleepMs(expectedPause);
        const stop = Date.now();

        // THEN
        expect(stop - start).toBeGreaterThanOrEqual(expectedPause);
    });
});

describe("getEnv", () => {
    it("should return an existing variables value", async () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new EnvironmentImpl();
        const variableKey = "sakuliEnvVar";
        const variableValue = "Hi from Sakuli!";
        process.env[variableKey] = variableValue;

        // WHEN
        const result = await SUT.getEnv(variableKey);

        // THEN
        expect(result).toBe(variableValue);
    });

    it("should return undefined for unknown variables", async () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new EnvironmentImpl();
        const variableKey = "unknownVar";

        // WHEN
        const result = await SUT.getEnv(variableKey);

        // THEN
        expect(result).toBeUndefined();
    });
});

describe("type", () => {
    it("should throw when no encryption key is set via env var", async () => {
        // GIVEN
        jest.setTimeout(10_000);
        const EnvironmentImpl = createEnvironmentClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new EnvironmentImpl();
        const input = "LAe8iDYgcIu/TUFaRSeJibKRE7L0gV2Bd8QC976qRqgSQ+cvPoXG/dU+6aS5+tXC";

        // WHEN

        // THEN
        await expect(SUT.typeAndDecrypt(input)).rejects.toThrow(`'${ENCRYPTION_KEY_VARIABLE}' is empty. Missing master key for secrets.`);
    });

    it("should type via keyboard", async () => {
        // GIVEN
        jest.setTimeout(10_000);
        const EnvironmentImpl = createEnvironmentClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new EnvironmentImpl();

        // WHEN

        // THEN
        await expect(SUT.type("Hello from Sakuli!")).resolves.not.toThrow();
    });

    it("should decrypt and type via keyboard", async () => {
        // GIVEN
        jest.setTimeout(10_000);
        const EnvironmentImpl = createEnvironmentClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new EnvironmentImpl();
        process.env[ENCRYPTION_KEY_VARIABLE] = "C9HikSYQW/K+ZvRphxEuSw==";
        const input = "LAe8iDYgcIu/TUFaRSeJibKRE7L0gV2Bd8QC976qRqgSQ+cvPoXG/dU+6aS5+tXC";

        // WHEN

        // THEN
        await expect(SUT.typeAndDecrypt(input)).resolves.not.toThrow();
    });

    it("should throw when key with invalid length is provided", async () => {
        // GIVEN
        jest.setTimeout(10_000);
        const EnvironmentImpl = createEnvironmentClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new EnvironmentImpl();
        process.env[ENCRYPTION_KEY_VARIABLE] = "foo";
        const input = "LAe8iDYgcIu/TUFaRSeJibKRE7L0gV2Bd8QC976qRqgSQ+cvPoXG/dU+6aS5+tXC";

        // WHEN

        // THEN
        await expect(SUT.typeAndDecrypt(input)).rejects.toThrow(`Invalid key length: 2`);
    });
});