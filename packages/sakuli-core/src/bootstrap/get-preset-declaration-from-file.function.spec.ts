import mockFs from "mock-fs";
import { getPresetDeclarationFromFile } from "./get-preset-declaration-from-file.function";
import { mockPartial } from "sneer";

global.console = mockPartial<Console>({ warn: jest.fn() });

describe("get-preset-from-package-json", () => {
  const packageJsonPath = "root/package.json";

  it("should load from package json file", async () => {
    //GIVEN
    mockFs({
      root: {
        "package.json": JSON.stringify({
          sakuli: {
            presetProvider: ["p1", "p2"],
          },
        }),
      },
    });

    //WHEN
    const presets = await getPresetDeclarationFromFile(packageJsonPath);

    //THEN
    expect(presets.length).toBe(2);
    expect(presets).toContain("p1");
    expect(presets).toContain("p2");
  });

  it("should return empty array when missing config", async () => {
    //GIVEN
    mockFs({
      root: {},
    });

    //WHEN
    const presets = await getPresetDeclarationFromFile(packageJsonPath);

    //THEN
    expect(presets.length).toBe(0);
  });

  it("should return empty array when package.json does not contain sakuli field", async () => {
    //GIVEN
    mockFs({
      root: {
        "package.json": JSON.stringify({}),
      },
    });

    //WHEN
    const presets = await getPresetDeclarationFromFile(packageJsonPath);

    //THEN
    expect(presets.length).toBe(0);
  });

  it("should return empty array when package.json does not contain sakuli presets", async () => {
    //GIVEN
    mockFs({
      root: {
        "package.json": JSON.stringify({
          sakuli: {},
        }),
      },
    });

    //WHEN
    const presets = await getPresetDeclarationFromFile(packageJsonPath);

    //THEN
    expect(presets.length).toBe(0);
  });

  it("should log a warning message an return default value in case preset loading fails", async () => {
    //GIVEN
    mockFs();

    //WHEN
    const presets = await getPresetDeclarationFromFile(packageJsonPath);

    //THEN
    expect(console.warn).toBeCalled();
    expect(presets.length).toBe(0);
  });

  afterEach(() => {
    mockFs.restore();
  });
});
