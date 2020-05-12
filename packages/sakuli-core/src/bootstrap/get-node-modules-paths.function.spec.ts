import { getNodeModulesPaths } from "./get-node-modules-paths.function";
import mockFs from "mock-fs";

const execa: jest.Mock = require("execa");

jest.mock("execa", () => jest.fn());
describe("get-node-modules-paths", () => {
  beforeEach(() => {
    (<jest.Mock>execa)
      .mockReturnValueOnce({ stdout: "/sakuli-test/node_modules" })
      .mockReturnValueOnce({ stdout: "/npm-root/node_modules" });
  });

  it("should return empty array when global and package level node_modules does not exist", async () => {
    // GIVEN
    mockFs({
      "/mockedFileSystem": {},
    });

    // WHEN
    const nodeModulesPaths = await getNodeModulesPaths();

    // THEN
    expect(nodeModulesPaths).toEqual([]);
  });

  it("should return global and package level node_modules", async () => {
    // GIVEN
    mockFs({
      "/npm-root": {
        node_modules: {
          "@sakuli": {},
        },
      },
      "/sakuli-test": {
        "test-suite": {},
        node_modules: {
          "@sakuli": {},
        },
      },
      "/another-dir": {
        node_modules: {
          "@sakuli": {},
        },
      },
    });

    // WHEN
    const nodeModulesPaths = await getNodeModulesPaths();

    // THEN
    expect(nodeModulesPaths).toEqual([
      "/sakuli-test/node_modules",
      "/npm-root/node_modules",
    ]);
  });

  afterEach(() => {
    mockFs.restore();
    jest.restoreAllMocks();
  });
});
