import {
  MASTERKEY_CLI_KEY,
  MASTERKEY_ENV_KEY,
  MASTERKEY_PROPERTY_KEY,
} from "../secrets.function";
import { createEnvironmentClass } from "./sakuli-environment.class";
import { PropertyMap, SimpleLogger } from "@sakuli/commons";
import { Project, TestExecutionContext } from "@sakuli/core";
import { prepareContext } from "../actions/__mocks__/prepare-context.function";

async function createMockProject(
  keyProperties: Map<string, string> = new Map()
) {
  const p = new Project("");
  await p.installPropertySource({
    createPropertyMap(): Promise<PropertyMap> {
      return Promise.resolve(keyProperties);
    },
  });
  return p;
}

describe("Similarity ", () => {
  const ctx = new TestExecutionContext(new SimpleLogger());

  beforeEach(() => {
    prepareContext(ctx);
  });

  it("should have a default value of 0.99", async () => {
    // GIVEN
    const EnvironmentImpl = createEnvironmentClass(
      ctx,
      await createMockProject()
    );
    const SUT = new EnvironmentImpl();
    const expectedResult = 0.99;

    // WHEN

    // THEN
    expect(SUT.getSimilarity()).toEqual(expectedResult);
  });

  it("should not update for value <= 0", async () => {
    // GIVEN
    const EnvironmentImpl = createEnvironmentClass(
      ctx,
      await createMockProject()
    );
    const SUT = new EnvironmentImpl();
    const expectedResult = 0.99;

    // WHEN
    SUT.setSimilarity(-10);

    // THEN
    expect(SUT.getSimilarity()).toEqual(expectedResult);
  });

  it("should not update for value == 0", async () => {
    // GIVEN
    const EnvironmentImpl = createEnvironmentClass(
      ctx,
      await createMockProject()
    );
    const SUT = new EnvironmentImpl();
    const expectedResult = 0.99;

    // WHEN
    SUT.setSimilarity(0);

    // THEN
    expect(SUT.getSimilarity()).toEqual(expectedResult);
  });

  it("should not update for values > 1", async () => {
    // GIVEN
    const EnvironmentImpl = createEnvironmentClass(
      ctx,
      await createMockProject()
    );
    const SUT = new EnvironmentImpl();
    const expectedResult = 0.99;

    // WHEN
    SUT.setSimilarity(10);

    // THEN
    expect(SUT.getSimilarity()).toEqual(expectedResult);
  });

  it("should reset to its default value", async () => {
    // GIVEN
    const EnvironmentImpl = createEnvironmentClass(
      ctx,
      await createMockProject()
    );
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
    const EnvironmentImpl = createEnvironmentClass(
      ctx,
      await createMockProject()
    );
    const SUT = new EnvironmentImpl();
    const pauseInSeconds = 1;

    // Added buffer to timer accuracy as `The callback will be called as close as possible to the time specified.`
    // https://nodejs.org/api/timers.html#timers_settimeout_callback_delay_args
    const expectedPauseInMilliseconds = 1000 * 0.99;
    const start = Date.now();

    // WHEN
    await SUT.sleep(pauseInSeconds);
    const stop = Date.now();

    // THEN
    expect(stop - start).toBeGreaterThanOrEqual(expectedPauseInMilliseconds);
  });

  it("should pause execution for a given delay in ms", async () => {
    // GIVEN
    const EnvironmentImpl = createEnvironmentClass(
      ctx,
      await createMockProject()
    );
    const SUT = new EnvironmentImpl();
    const pause = 200;

    // Added buffer to timer accuracy as `The callback will be called as close as possible to the time specified.`
    // https://nodejs.org/api/timers.html#timers_settimeout_callback_delay_args
    const expectedMinimumPause = pause * 0.99;
    const start = Date.now();

    // WHEN
    await SUT.sleepMs(pause);
    const stop = Date.now();

    // THEN
    expect(stop - start).toBeGreaterThanOrEqual(expectedMinimumPause);
  });
});

describe("getEnv", () => {
  const ctx = new TestExecutionContext(new SimpleLogger());

  beforeEach(() => {
    prepareContext(ctx);
  });

  it("should return an existing variables value", async () => {
    // GIVEN
    const variableKey = "sakuliEnvVar";
    const variableValue = "Hi from Sakuli!";
    const envProperties = new Map([[variableKey, variableValue]]);
    const EnvironmentImpl = createEnvironmentClass(
      ctx,
      await createMockProject(envProperties)
    );
    const SUT = new EnvironmentImpl();
    process.env[variableKey] = variableValue;

    // WHEN
    const result = await SUT.getEnv(variableKey);

    // THEN
    expect(result).toBe(variableValue);
  });

  it("should return undefined for unknown variables", async () => {
    // GIVEN
    const EnvironmentImpl = createEnvironmentClass(
      ctx,
      await createMockProject()
    );
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
    const variableKey = "foo";
    const variableValue = "bar";
    const properties = new Map([[variableKey, variableValue]]);
    const EnvironmentImpl = createEnvironmentClass(
      ctx,
      await createMockProject(properties)
    );
    const SUT = new EnvironmentImpl();

    // WHEN
    const result = await SUT.getProperty(variableKey);

    // THEN
    expect(result).toBe(variableValue);
  });

  it("should return null for unknown variables", async () => {
    // GIVEN
    const EnvironmentImpl = createEnvironmentClass(
      ctx,
      await createMockProject()
    );
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

  it.each([[MASTERKEY_CLI_KEY], [MASTERKEY_PROPERTY_KEY], [MASTERKEY_ENV_KEY]])(
    "should decrypt using key from %s",
    async (source: string) => {
      // GIVEN
      jest.setTimeout(10_000);
      const keyProperties = new Map([[source, "C9HikSYQW/K+ZvRphxEuSw=="]]);
      const p = await createMockProject(keyProperties);
      const EnvironmentImpl = createEnvironmentClass(ctx, p);
      const SUT = new EnvironmentImpl();
      const input =
        "LAe8iDYgcIu/TUFaRSeJibKRE7L0gV2Bd8QC976qRqgSQ+cvPoXG/dU+6aS5+tXC";
      const expected = "Can you keep a secret?";

      // WHEN
      const result = await SUT.decryptSecret(input);

      // THEN
      expect(result).toEqual(expected);
    }
  );

  it("should throw when no encryption key is set", async () => {
    // GIVEN
    jest.setTimeout(10_000);
    const keyProperties = new Map<string, string>();
    const p = await createMockProject(keyProperties);
    const EnvironmentImpl = createEnvironmentClass(ctx, p);
    const SUT = new EnvironmentImpl();
    const input =
      "LAe8iDYgAcIu/TUFaRSeJibKRE7L0gV2Bd8QC976qRqgSQ+cvPoXG/dU+6aS5+tXC";
    const expected =
      "Masterkey could not be found in one of '--masterkey' CLI option, 'sakuli.encryption.key' property or 'SAKULI_ENCRYPTION_KEY' env var. Missing master key for secrets.";

    // WHEN

    // THEN
    await expect(SUT.typeAndDecrypt(input)).rejects.toThrow(expected);
  });

  it("should type via keyboard", async () => {
    // GIVEN
    jest.setTimeout(10_000);
    const EnvironmentImpl = createEnvironmentClass(
      ctx,
      await createMockProject()
    );
    const SUT = new EnvironmentImpl();

    // WHEN

    // THEN
    await expect(SUT.type("Hello from Sakuli!")).resolves.not.toThrow();
  });

  it.each([[MASTERKEY_CLI_KEY], [MASTERKEY_PROPERTY_KEY], [MASTERKEY_ENV_KEY]])(
    "should decrypt key from %s and type via keyboard",
    async (source: string) => {
      // GIVEN
      jest.setTimeout(10_000);
      const keyProperties = new Map([[source, "C9HikSYQW/K+ZvRphxEuSw=="]]);
      const p = await createMockProject(keyProperties);
      const EnvironmentImpl = createEnvironmentClass(ctx, p);
      const SUT = new EnvironmentImpl();
      const input =
        "LAe8iDYgcIu/TUFaRSeJibKRE7L0gV2Bd8QC976qRqgSQ+cvPoXG/dU+6aS5+tXC";

      // WHEN

      // THEN
      await expect(SUT.typeAndDecrypt(input)).resolves.not.toThrow();
    }
  );

  it.each([[MASTERKEY_CLI_KEY], [MASTERKEY_PROPERTY_KEY], [MASTERKEY_ENV_KEY]])(
    "should throw when key with invalid length is provided from %s",
    async (source: string) => {
      // GIVEN
      jest.setTimeout(10_000);
      const keyProperties = new Map([[source, "foo"]]);
      const p = await createMockProject(keyProperties);
      const EnvironmentImpl = createEnvironmentClass(ctx, p);
      const SUT = new EnvironmentImpl();
      const input =
        "LAe8iDYgcIu/TUFaRSeJibKRE7L0gV2Bd8QC976qRqgSQ+cvPoXG/dU+6aS5+tXC";

      // WHEN

      // THEN
      await expect(SUT.typeAndDecrypt(input)).rejects.toThrow(
        `Invalid key length`
      );
    }
  );
});
