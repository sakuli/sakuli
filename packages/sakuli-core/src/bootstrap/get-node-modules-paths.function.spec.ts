import { getNodeModulesPaths } from "./get-node-modules-paths.function";
import * as isExistingDirectoryDependency from "./is-existing-directory.function";
import { mockPartial } from "sneer";

const execa: jest.Mock = require("execa");

jest.mock("execa", () => jest.fn());
jest.mock("./is-existing-directory.function");
global.console = mockPartial<Console>({
  debug: jest.fn(),
});

describe("get-node-modules-paths", () => {
  const isExistingDirectory = <jest.Mock<boolean>>(
    isExistingDirectoryDependency.isExistingDirectory
  );

  beforeEach(() => {
    jest.resetAllMocks();
    (<jest.Mock>execa)
      .mockReturnValueOnce({ stdout: "/sakuli-test/node_modules" })
      .mockReturnValueOnce({ stdout: "/npm-root/node_modules" });
  });

  it("should return empty array when global and package level node_modules does not exist", async () => {
    // GIVEN
    isExistingDirectory.mockReturnValue(false);

    // WHEN
    const nodeModulesPaths = await getNodeModulesPaths();

    // THEN
    expect(nodeModulesPaths).toEqual([]);
    expect(console.debug).toHaveBeenCalledWith("node_modules not found");
  });

  it("should return global and package level node_modules", async () => {
    // GIVEN
    isExistingDirectory.mockReturnValue(true);

    // WHEN
    const nodeModulesPaths = await getNodeModulesPaths();

    // THEN
    expect(nodeModulesPaths).toEqual([
      "/sakuli-test/node_modules",
      "/npm-root/node_modules",
    ]);
    expect(console.debug).toHaveBeenCalledWith(
      `node_modules found: ${nodeModulesPaths}`
    );
  });
});
