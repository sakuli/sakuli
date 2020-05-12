import mockFs from "mock-fs";
import { getSakuliPresets } from "./get-sakuli-presets.function";

describe("get-sakuli-presets", () => {
  it("should return @sakuli/legacy as sakuli preset", () => {
    mockFs({
      node_modules: {
        "@custom": {
          preset: {
            "package.json":
              '{ "name": "@custom/preset", "keywords": [ "sakuliPreset" ] }',
          },
        },
        "@sakuli": {
          cli: {
            "package.json":
              '{ "name": "@sakuli/cli", "keywords": [ "e2e", "sakuli" ] }',
          },
          legacy: {
            "package.json":
              '{ "name": "@sakuli/legacy", "keywords": [ "sakuliPreset" ] }',
          },
          "empty-dir": {},
        },
      },
    });

    const sakuliPresets = getSakuliPresets(["node_modules"]);

    expect(sakuliPresets).toEqual(["@sakuli/legacy"]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockFs.restore();
  });
});
