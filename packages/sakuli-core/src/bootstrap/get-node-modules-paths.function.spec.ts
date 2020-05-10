import { getNodeModulesPaths } from "./get-node-modules-paths.function";
import mockFs from "mock-fs";

const execa: jest.Mock = require("execa");

jest.mock("execa", () => jest.fn());
describe("get-node-modules-paths", () => {
  beforeEach(() => {
    (<jest.Mock>execa).mockReturnValueOnce({ stdout: "/execa" });
  });

  it("should return empty array", async () => {
    // GIVEN
    const path = "/foo/bar";
    mockFs({
      "/mockedFileSystem": {},
    });

    // WHEN
    const nodeModulesPaths = await getNodeModulesPaths(path);

    // THEN
    expect(nodeModulesPaths).toEqual([]);
  });

  it("should return three module paths", async () => {
    // GIVEN
    const path = "/foo/bar";
    mockFs({
      "/execa": {
        node_modules: {
          "@sakuli": {},
        },
      },
      "/foo": {
        bar: {},
        node_modules: {
          "@sakuli": {},
        },
      },
      "/node_modules": {
        "@sakuli": {},
      },
    });

    // WHEN
    const nodeModulesPaths = await getNodeModulesPaths(path);

    // THEN
    expect(nodeModulesPaths).toEqual([
      "/foo/node_modules/@sakuli",
      "/node_modules/@sakuli",
      "/execa/@sakuli",
    ]);
  });

  afterEach(() => {
    mockFs.restore();
    jest.restoreAllMocks();
  });
});
