import {MASTERKEY_CLI_KEY, MASTERKEY_ENV_KEY, MASTERKEY_PROPERTY_KEY} from "../secrets.function";
import {createEnvironmentClass} from "./sakuli-environment.class";
import {SimpleLogger} from "@sakuli/commons";
import {Project, TestExecutionContext} from "@sakuli/core";
import {mockPartial} from "sneer";
import {prepareContext} from "../actions/__mocks__/prepare-context.function";

const mockProject = mockPartial<Project>({
    get: (param: string) => (param === "foo") ? "bar" : null,
});

describe("Similarity ", () => {
    const ctx = new TestExecutionContext(new SimpleLogger());

    beforeEach(() => {
        prepareContext(ctx);
    });

    it("should have a default value of 0.99", async () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        const SUT = new EnvironmentImpl();
        const expectedResult = 0.99;

        // WHEN

        // THEN
        expect(SUT.getSimilarity()).toEqual(expectedResult);
    });

    it("should not update for value <= 0", async () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        const SUT = new EnvironmentImpl();
        const expectedResult = 0.99;

        // WHEN
        SUT.setSimilarity(-10);

        // THEN
        expect(SUT.getSimilarity()).toEqual(expectedResult);
    });

    it("should not update for value == 0", async () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        const SUT = new EnvironmentImpl();
        const expectedResult = 0.99;

        // WHEN
        SUT.setSimilarity(0);

        // THEN
        expect(SUT.getSimilarity()).toEqual(expectedResult);
    });

    it("should not update for values > 1", async () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        const SUT = new EnvironmentImpl();
        const expectedResult = 0.99;

        // WHEN
        SUT.setSimilarity(10);

        // THEN
        expect(SUT.getSimilarity()).toEqual(expectedResult);
    });

    it("should reset to its default value", async () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
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

    const ctx = new TestExecutionContext(new SimpleLogger());

    beforeEach(() => {
        prepareContext(ctx);
    });

    it("should pause execution for a given delay in seconds", async () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
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
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
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

    const ctx = new TestExecutionContext(new SimpleLogger());

    beforeEach(() => {
        prepareContext(ctx);
    });

    it("should return an existing variables value", async () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
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
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        const SUT = new EnvironmentImpl();
        const variableKey = "unknownVar";

        // WHEN
        const result = await SUT.getEnv(variableKey);

        // THEN
        expect(result).toBeNull();
    });
});

describe("getProperty", () => {

    const ctx = new TestExecutionContext(new SimpleLogger());

    beforeEach(() => {
        prepareContext(ctx);
    });

    it("should return an existing variables value", async () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
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
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        const SUT = new EnvironmentImpl();
        const variableKey = "unknownVar";

        // WHEN
        const result = await SUT.getProperty(variableKey);

        // THEN
        expect(result).toBeNull();
    });
});

describe("type", () => {

    const ctx = new TestExecutionContext(new SimpleLogger());

    beforeEach(() => {
        prepareContext(ctx);
    });

    it.each([
        [MASTERKEY_ENV_KEY],
        [MASTERKEY_CLI_KEY],
        [MASTERKEY_PROPERTY_KEY],
    ])("should decrypt using key from %s", async (source: string) => {
        // GIVEN
        jest.setTimeout(10_000);
        const mockProject = mockPartial<Project>({
            get: (param: string) => (param === source) ? "C9HikSYQW/K+ZvRphxEuSw==" : null,
        });
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        const SUT = new EnvironmentImpl();
        const input = "LAe8iDYgcIu/TUFaRSeJibKRE7L0gV2Bd8QC976qRqgSQ+cvPoXG/dU+6aS5+tXC";

        // WHEN
        const result = await SUT.decryptSecret(input);
        console.log(result);

        // THEN
    });

    it("should throw when no encryption key is set", async () => {
        // GIVEN
        jest.setTimeout(10_000);
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        const SUT = new EnvironmentImpl();
        const input = "LAe8iDYgAcIu/TUFaRSeJibKRE7L0gV2Bd8QC976qRqgSQ+cvPoXG/dU+6aS5+tXC";
        const expected = "Masterkey could not be found in one of '--masterkey' CLI option, 'sakuli.encryption.key' property or 'SAKULI_ENCRYPTION_KEY' env var. Missing master key for secrets.";

        // WHEN

        // THEN
        await expect(SUT.typeAndDecrypt(input)).rejects.toThrow(expected);
    });

    it("should type via keyboard", async () => {
        // GIVEN
        jest.setTimeout(10_000);
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        const SUT = new EnvironmentImpl();

        // WHEN

        // THEN
        await expect(SUT.type("Hello from Sakuli!")).resolves.not.toThrow();
    });

    it("should decrypt and type via keyboard", async () => {
        // GIVEN
        jest.setTimeout(10_000);
        const mockProject = mockPartial<Project>({
            get: (param: string) => (param === MASTERKEY_ENV_KEY) ? "C9HikSYQW/K+ZvRphxEuSw==" : null,
        });
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        const SUT = new EnvironmentImpl();
        const input = "LAe8iDYgcIu/TUFaRSeJibKRE7L0gV2Bd8QC976qRqgSQ+cvPoXG/dU+6aS5+tXC";

        // WHEN

        // THEN
        await expect(SUT.typeAndDecrypt(input)).resolves.not.toThrow();
    });

    it("should throw when key with invalid length is provided", async () => {
        // GIVEN
        jest.setTimeout(10_000);
        const mockProject = mockPartial<Project>({
            get: (param: string) => (param === MASTERKEY_ENV_KEY) ? "foo" : null,
        });
        const EnvironmentImpl = createEnvironmentClass(ctx, mockProject);
        const SUT = new EnvironmentImpl();
        const input = "LAe8iDYgcIu/TUFaRSeJibKRE7L0gV2Bd8QC976qRqgSQ+cvPoXG/dU+6aS5+tXC";

        // WHEN

        // THEN
        await expect(SUT.typeAndDecrypt(input)).rejects.toThrow(`Invalid key length: 2`);
    });
});