import { loadBootstrapOptions } from "./load-bootstrap-options.function";
import { getSakuliPresets } from "./get-sakuli-presets.function";
import { getNodeModulesPaths } from "./get-node-modules-paths.function";
import { SakuliBootstrapDefaults } from "./bootstrap-options.interface";

jest.mock("./get-node-modules-paths.function", () => ({
  getNodeModulesPaths: jest.fn(),
}));
jest.mock("./get-sakuli-presets.function", () => ({
  getSakuliPresets: jest.fn(),
}));

describe("loadBootstrapOptions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return bar as bootstrapOption", async () => {
    //GIVEN
    jest.spyOn(process, "cwd");
    (<jest.Mock>getNodeModulesPaths).mockReturnValue("foo");
    (<jest.Mock>getSakuliPresets).mockReturnValue("bar");

    //WHEN
    const bootstrapOptions = await loadBootstrapOptions();

    //THEN
    expect(process.cwd).toHaveBeenCalledTimes(1);
    expect(getNodeModulesPaths).toHaveBeenCalledTimes(1);
    expect(getSakuliPresets).toHaveBeenCalledWith("foo");
    expect(bootstrapOptions.presetProvider).toContain("bar");
  });

  it("should return SakuliBootstrapDefaults when getNodeModulesPaths throws error", async () => {
    // GIVEN
    jest.spyOn(process, "cwd");
    (<jest.Mock>getNodeModulesPaths).mockImplementation(() => {
      throw Error();
    });

    // WHEN
    const bootstrapOptions = await loadBootstrapOptions();

    // THEN
    expect(process.cwd).toHaveBeenCalledTimes(1);
    expect(getNodeModulesPaths).toThrowError();
    expect(getSakuliPresets).not.toBeCalled();
    expect(bootstrapOptions).toBe(SakuliBootstrapDefaults);
  });

  it("should return SakuliBootstrapDefaults when getSakuliPresets throws error", async () => {
    // GIVEN
    jest.spyOn(process, "cwd");
    (<jest.Mock>getSakuliPresets).mockImplementation(() => {
      throw Error();
    });

    // WHEN
    const bootstrapOptions = await loadBootstrapOptions();

    // THEN
    expect(process.cwd).toHaveBeenCalledTimes(1);
    expect(getNodeModulesPaths).toBeCalledTimes(1);
    expect(getSakuliPresets).toThrowError();
    expect(bootstrapOptions).toBe(SakuliBootstrapDefaults);
  });
});
