import mockFs from "mock-fs";
import { findSakuliPresets } from "./find-sakuli-presets.function";
import { mockPartial } from "sneer";

global.console = mockPartial<Console>({
  debug: jest.fn(),
});
describe("get-sakuli-presets", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
    const sakuliPresets = findSakuliPresets(["node_modules"]);

    //THEN
    expect(sakuliPresets).toEqual(["@sakuli/legacy"]);
    expect(console.debug).toHaveBeenCalledWith(
      "Sakuli presets found during auto discovery: @sakuli/legacy"
    );
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
    const sakuliPresets = findSakuliPresets(["node_modules"]);

    //THEN
    expect(sakuliPresets).toEqual([]);
    expect(console.debug).toHaveBeenCalledWith(
      "No Sakuli presets found during auto discovery"
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockFs.restore();
  });
});
