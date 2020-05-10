import mockFs from "mock-fs";
import { getSakuliPresets } from "./get-sakuli-presets.function";

describe("get-sakuli-presets", () => {
  it("should return execa package name", () => {
    mockFs({
      "/base": {
        execa: {
          "package.json":
            '{ "name": "sakuli", "keywords": [ "sakuliPreset" ] }',
        },
        foo: {
          "package.json": '{ "name": "just another package json" }',
        },
        "empty-dir": {},
      },
    });

    const sakuliPresets = getSakuliPresets(["/base"]);

    expect(sakuliPresets).toEqual(["sakuli"]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockFs.restore();
  });
});
