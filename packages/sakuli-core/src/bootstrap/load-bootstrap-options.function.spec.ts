import { loadBootstrapOptions } from "./load-bootstrap-options.function";
import { findSakuliPresets } from "./find-sakuli-presets.function";
import { getNodeModulesPaths } from "./get-node-modules-paths.function";
import { SakuliBootstrapDefaults } from "./bootstrap-options.interface";
import { getPresetDeclarationFromFile } from "./get-preset-declaration-from-file.function";
import { cwd } from "process";

jest.mock("./get-node-modules-paths.function", () => ({
  getNodeModulesPaths: jest.fn(),
}));
jest.mock("./find-sakuli-presets.function", () => ({
  findSakuliPresets: jest.fn(),
}));
jest.mock("./get-preset-declaration-from-file.function", () => ({
  getPresetDeclarationFromFile: jest.fn(),
}));
jest.mock("process", () => ({
  cwd: jest.fn(),
}));

describe("loadBootstrapOptions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return @sakuli/legacy from node_modules as bootstrapOption", async () => {
    //GIVEN
    (<jest.Mock>getNodeModulesPaths).mockReturnValue("./node_modules");
    (<jest.Mock>findSakuliPresets).mockReturnValue(["@sakuli/legacy"]);
    (<jest.Mock>cwd).mockReturnValueOnce("just-a-path");
    (<jest.Mock>getPresetDeclarationFromFile).mockReturnValueOnce([]);

    //WHEN
    const bootstrapOptions = await loadBootstrapOptions();

    //THEN
    expect(bootstrapOptions.presetProvider).toEqual(["@sakuli/legacy"]);
  });

  it("should return @sakuli/legacy from file as bootstrapOption", async () => {
    //GIVEN
    (<jest.Mock>getNodeModulesPaths).mockReturnValue("foo");
    (<jest.Mock>findSakuliPresets).mockReturnValue("[]");
    (<jest.Mock>cwd).mockReturnValueOnce("just-a-path");
    (<jest.Mock>getPresetDeclarationFromFile).mockReturnValueOnce([
      "@sakuli/legacy",
    ]);

    //WHEN
    const bootstrapOptions = await loadBootstrapOptions();

    //THEN
    expect(bootstrapOptions.presetProvider).toEqual(["@sakuli/legacy"]);
  });

  it("should return @sakuli/legacy only once as bootstrapOption", async () => {
    //GIVEN
    (<jest.Mock>getNodeModulesPaths).mockReturnValue("foo");
    (<jest.Mock>findSakuliPresets).mockReturnValue(["@sakuli/legacy"]);
    (<jest.Mock>cwd).mockReturnValueOnce("just-a-path");
    (<jest.Mock>getPresetDeclarationFromFile).mockReturnValueOnce([
      "@sakuli/legacy",
    ]);

    //WHEN
    const bootstrapOptions = await loadBootstrapOptions();

    //THEN
    expect(bootstrapOptions.presetProvider).toEqual(["@sakuli/legacy"]);
  });

  it("should return SakuliBootstrapDefaults when getNodeModulesPaths throws error", async () => {
    // GIVEN
    (<jest.Mock>getNodeModulesPaths).mockImplementation(() => {
      throw Error();
    });

    // WHEN
    const bootstrapOptions = await loadBootstrapOptions();

    // THEN
    expect(bootstrapOptions).toBe(SakuliBootstrapDefaults);
  });

  it("should return SakuliBootstrapDefaults when getSakuliPresets throws error", async () => {
    // GIVEN
    (<jest.Mock>findSakuliPresets).mockImplementation(() => {
      throw Error();
    });

    // WHEN
    const bootstrapOptions = await loadBootstrapOptions();

    // THEN
    expect(bootstrapOptions).toBe(SakuliBootstrapDefaults);
  });

  it("should return SakuliBootstrapDefaults when getPresetFromFile throws error", async () => {
    // GIVEN
    (<jest.Mock>getPresetDeclarationFromFile).mockImplementation(() => {
      throw Error();
    });

    // WHEN
    const bootstrapOptions = await loadBootstrapOptions();

    // THEN
    expect(bootstrapOptions).toBe(SakuliBootstrapDefaults);
  });
});
