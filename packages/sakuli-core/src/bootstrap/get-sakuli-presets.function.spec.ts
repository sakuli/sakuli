import mockFs from "mock-fs";
import { getSakuliPresets } from "./get-sakuli-presets.function";

describe("get-sakuli-presets", () => {
  it("should return @sakuli/legacy as sakuli preset", () => {
    //GIVEN
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

    //WHEN
    const sakuliPresets = getSakuliPresets(["node_modules"]);

    //THEN
    expect(sakuliPresets).toEqual(["@sakuli/legacy"]);
  });

  it("should return empty array in case package name is missing", () => {
    //GIVEN
    mockFs({
      node_modules: {
        "@sakuli": {
          legacy: {
            "package.json": '{"keywords": [ "sakuliPreset" ] }',
          },
        },
      },
    });

    //WHEN
    const sakuliPresets = getSakuliPresets(["node_modules"]);

    //THEN
    expect(sakuliPresets).toEqual([]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockFs.restore();
  });
});
