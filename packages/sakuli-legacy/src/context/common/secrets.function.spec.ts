import { mockPartial } from "sneer";
import { Project } from "@sakuli/core";
import {
  decrypt,
  getEncryptionKey,
  MASTERKEY_CLI_KEY,
  MASTERKEY_ENV_KEY,
  MASTERKEY_PROPERTY_KEY,
  withEncryption,
} from "./secrets.function";

describe("secrets", () => {
  describe("decrypt", () => {
    it("should return correct decrypted text", async () => {
      // GIVEN
      const inputString = "Yk8LoJUqJ2IeHixL9+ZrRkLRary3moS4JpLMrnHs3Yc=";
      const masterKey = "90w0jpwGE6qLYcNDYYXMSQ==";
      const decryptedOutput = "teststring";

      // WHEN
      const result = await decrypt(masterKey, inputString);

      // THEN
      expect(result).toEqual(decryptedOutput);
    });

    it("should throw due to invalid masterkey", async () => {
      // GIVEN
      const inputString = "Yk8LoJUqJ2IeHixL9+ZrRkLRary3moS4JpLMrnHs3Yc=";
      const masterKey = "foo";

      // WHEN
      const testAction = decrypt(masterKey, inputString);

      // THEN
      await expect(testAction).rejects.toThrowError("Invalid key length");
    });
  });

  describe("withEncryption", () => {
    it("should pass correct decrypted text to callback", async () => {
      // GIVEN
      const inputString = "Yk8LoJUqJ2IeHixL9+ZrRkLRary3moS4JpLMrnHs3Yc=";
      const masterKey = "90w0jpwGE6qLYcNDYYXMSQ==";
      const decryptedOutput = "teststring";
      const callback = jest.fn();

      // WHEN
      await withEncryption(masterKey, inputString, callback);

      // THEN
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(decryptedOutput);
    });

    it("should throw due to invalid masterkey", async () => {
      // GIVEN
      const inputString = "Yk8LoJUqJ2IeHixL9+ZrRkLRary3moS4JpLMrnHs3Yc=";
      const masterKey = "foo";
      const callback = jest.fn();

      // WHEN
      const testAction = withEncryption(masterKey, inputString, callback);

      // THEN
      await expect(testAction).rejects.toThrowError("Invalid key length");
    });
  });

  describe("getEncryptionKey", () => {
    it("should throw on missing masterkey", () => {
      // GIVEN
      const mockProject = mockPartial<Project>({
        objectFactory: jest.fn().mockReturnValue({
          environmentKey: undefined,
          cliKey: undefined,
          propsKey: undefined,
        }),
      });

      // WHEN
      const testAction = () => getEncryptionKey(mockProject);

      // THEN
      expect(testAction).toThrowError(
        `Masterkey could not be found in one of '--${MASTERKEY_CLI_KEY}' CLI option, '${MASTERKEY_PROPERTY_KEY}' property or '${MASTERKEY_ENV_KEY}' env var. Missing master key for secrets.`
      );
    });

    it.each(<[string, string][]>[
      ["envMasterkey", "environmentKey"],
      ["cliMasterkey", "cliKey"],
      ["propsMasterkey", "propsKey"],
    ])(
      "should return %s for property %s",
      (value: string, propertyKey: string) => {
        // GIVEN
        const mockProject = mockPartial<Project>({
          objectFactory: jest.fn().mockReturnValue({
            [propertyKey]: value,
          }),
        });

        // WHEN
        const testAction = () => getEncryptionKey(mockProject);

        // THEN
        expect(testAction()).toEqual(value);
      }
    );
  });

  describe("Key hierarchy", () => {
    it("should return environment masterkey", () => {
      // GIVEN
      const envKey = "envKey";
      const mockProject = mockPartial<Project>({
        objectFactory: jest.fn().mockReturnValue({
          environmentKey: envKey,
          cliKey: undefined,
          propsKey: undefined,
        }),
      });

      // WHEN
      const testAction = () => getEncryptionKey(mockProject);

      // THEN
      expect(testAction()).toEqual(envKey);
    });

    it("should return property over environment masterkey", () => {
      // GIVEN
      const propKey = "propKey";
      const envKey = "envKey";
      const mockProject = mockPartial<Project>({
        objectFactory: jest.fn().mockReturnValue({
          environmentKey: envKey,
          cliKey: undefined,
          propsKey: propKey,
        }),
      });

      // WHEN
      const testAction = () => getEncryptionKey(mockProject);

      // THEN
      expect(testAction()).toEqual(propKey);
    });

    it("should return CLI over property masterkey", () => {
      // GIVEN
      const propKey = "propKey";
      const cliKey = "cliKey";
      const mockProject = mockPartial<Project>({
        objectFactory: jest.fn().mockReturnValue({
          environmentKey: undefined,
          cliKey: cliKey,
          propsKey: propKey,
        }),
      });

      // WHEN
      const testAction = () => getEncryptionKey(mockProject);

      // THEN
      expect(testAction()).toEqual(cliKey);
    });

    it("should return CLI masterkey over other masterkeys", () => {
      // GIVEN
      const propKey = "propKey";
      const envKey = "envKey";
      const cliKey = "cliKey";
      const mockProject = mockPartial<Project>({
        objectFactory: jest.fn().mockReturnValue({
          environmentKey: envKey,
          cliKey: cliKey,
          propsKey: propKey,
        }),
      });

      // WHEN
      const testAction = () => getEncryptionKey(mockProject);

      // THEN
      expect(testAction()).toEqual(cliKey);
    });
  });
});
