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
    (<jest.Mock>getNodeModulesPaths).mockReturnValue("foo");
    (<jest.Mock>getSakuliPresets).mockReturnValue("bar");

    //WHEN
    const bootstrapOptions = await loadBootstrapOptions();

    //THEN
    expect(bootstrapOptions.presetProvider).toContain("bar");
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
    (<jest.Mock>getSakuliPresets).mockImplementation(() => {
      throw Error();
    });

    // WHEN
    const bootstrapOptions = await loadBootstrapOptions();

    // THEN
    expect(bootstrapOptions).toBe(SakuliBootstrapDefaults);
  });
});
