import mockFs from "mock-fs";
import { getPresetFromFile } from "./get-preset-from-file.function";

describe("get-preset-from-package-json", () => {
  const path = "root";
  const file = "package.json";

  it("should load from package json file", async () => {
    mockFs({
      root: {
        "package.json": JSON.stringify({
          sakuli: {
            presetProvider: ["p1", "p2"],
          },
        }),
      },
    });

    const presets = await getPresetFromFile(path, file);
    expect(presets.length).toBe(2);
    expect(presets).toContain("p1");
    expect(presets).toContain("p2");
  });

  it("should return empty array when missing config", async () => {
    mockFs({
      root: {},
    });
    const presets = await getPresetFromFile(path, file);
    expect(presets.length).toBe(0);
  });

  afterEach(() => {
    mockFs.restore();
  });
});
