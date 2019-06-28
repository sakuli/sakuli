import {MASTERKEY_ENV_KEY} from "../secrets.function";
import {createEnvironmentClass} from "./sakuli-environment.class";
import {SimpleLogger} from "@sakuli/commons";
import {Project, TestExecutionContext} from "@sakuli/core";
import {mockPartial} from "sneer";

const mockProject = mockPartial<Project>({
    get: (param: string) => (param === "foo") ? "bar" : null,
});
const prepareContext = (ctx: TestExecutionContext) => {
    ctx.startExecution();
    ctx.startTestSuite();
    ctx.startTestCase();
    ctx.startTestStep();
};

describe("Similarity ", () => {
    it("should have a default value of 0.99", async () => {
        // GIVEN
        const ctx = new TestExecutionContext(new SimpleLogger());
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        prepareContext(ctx);
        const SUT = new EnvironmentImpl();
        const expectedResult = 0.99;

        // WHEN

        // THEN
        expect(SUT.getSimilarity()).toEqual(expectedResult);
    });

    it("should not update for value <= 0", async () => {
        // GIVEN
        const ctx = new TestExecutionContext(new SimpleLogger());
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        prepareContext(ctx);
        const SUT = new EnvironmentImpl();
        const expectedResult = 0.99;

        // WHEN
        SUT.setSimilarity(-10);

        // THEN
        expect(SUT.getSimilarity()).toEqual(expectedResult);
    });

    it("should not update for value == 0", async () => {
        // GIVEN
        const ctx = new TestExecutionContext(new SimpleLogger());
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        prepareContext(ctx);
        const SUT = new EnvironmentImpl();
        const expectedResult = 0.99;

        // WHEN
        SUT.setSimilarity(0);

        // THEN
        expect(SUT.getSimilarity()).toEqual(expectedResult);
    });

    it("should not update for values > 1", async () => {
        // GIVEN
        const ctx = new TestExecutionContext(new SimpleLogger());
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        prepareContext(ctx);
        const SUT = new EnvironmentImpl();
        const expectedResult = 0.99;

        // WHEN
        SUT.setSimilarity(10);

        // THEN
        expect(SUT.getSimilarity()).toEqual(expectedResult);
    });

    it("should reset to its default value", async () => {
        // GIVEN
        const ctx = new TestExecutionContext(new SimpleLogger());
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        prepareContext(ctx);
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
        const ctx = new TestExecutionContext(new SimpleLogger());
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        prepareContext(ctx);
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
        const ctx = new TestExecutionContext(new SimpleLogger());
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        prepareContext(ctx);
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
        const ctx = new TestExecutionContext(new SimpleLogger());
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        prepareContext(ctx);
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
        const ctx = new TestExecutionContext(new SimpleLogger());
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        prepareContext(ctx);
        const SUT = new EnvironmentImpl();
        const variableKey = "unknownVar";

        // WHEN
        const result = await SUT.getEnv(variableKey);

        // THEN
        expect(result).toBeNull();
    });
});

describe("getProperty", () => {
    it("should return an existing variables value", async () => {
        // GIVEN
        const ctx = new TestExecutionContext(new SimpleLogger());
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        prepareContext(ctx);
        const SUT = new EnvironmentImpl();
        const variableKey = "foo";
        const variableValue = "bar";

        // WHEN
        const result = await SUT.getProperty(variableKey);

        // THEN
        expect(result).toBe(variableValue);
    });

    it("should return undefined for unknown variables", async () => {
        // GIVEN
        const ctx = new TestExecutionContext(new SimpleLogger());
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        prepareContext(ctx);
        const SUT = new EnvironmentImpl();
        const variableKey = "unknownVar";

        // WHEN
        const result = await SUT.getProperty(variableKey);

        // THEN
        expect(result).toBeNull();
    });
});

describe("type", () => {
    it("should throw when no encryption key is set via env var", async () => {
        // GIVEN
        jest.setTimeout(10_000);
        const ctx = new TestExecutionContext(new SimpleLogger());
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        prepareContext(ctx);
        const SUT = new EnvironmentImpl();
        const input = "LAe8iDYgcIu/TUFaRSeJibKRE7L0gV2Bd8QC976qRqgSQ+cvPoXG/dU+6aS5+tXC";

        // WHEN

        // THEN
        await expect(SUT.typeAndDecrypt(input)).rejects.toThrow(`'${MASTERKEY_ENV_KEY}' is empty. Missing master key for secrets.`);
    });

    it("should type via keyboard", async () => {
        // GIVEN
        jest.setTimeout(10_000);
        const ctx = new TestExecutionContext(new SimpleLogger());
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        prepareContext(ctx);
        const SUT = new EnvironmentImpl();

        // WHEN

        // THEN
        await expect(SUT.type("Hello from Sakuli!")).resolves.not.toThrow();
    });

    it("should decrypt and type via keyboard", async () => {
        // GIVEN
        jest.setTimeout(10_000);
        const ctx = new TestExecutionContext(new SimpleLogger());
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        prepareContext(ctx);
        const SUT = new EnvironmentImpl();
        process.env[MASTERKEY_ENV_KEY] = "C9HikSYQW/K+ZvRphxEuSw==";
        const input = "LAe8iDYgcIu/TUFaRSeJibKRE7L0gV2Bd8QC976qRqgSQ+cvPoXG/dU+6aS5+tXC";

        // WHEN

        // THEN
        await expect(SUT.typeAndDecrypt(input)).resolves.not.toThrow();
    });

    it("should throw when key with invalid length is provided", async () => {
        // GIVEN
        jest.setTimeout(10_000);
        const ctx = new TestExecutionContext(new SimpleLogger());
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        prepareContext(ctx);
        const SUT = new EnvironmentImpl();
        process.env[MASTERKEY_ENV_KEY] = "foo";
        const input = "LAe8iDYgcIu/TUFaRSeJibKRE7L0gV2Bd8QC976qRqgSQ+cvPoXG/dU+6aS5+tXC";

        // WHEN

        // THEN
        await expect(SUT.typeAndDecrypt(input)).rejects.toThrow(`Invalid key length: 2`);
    });
});