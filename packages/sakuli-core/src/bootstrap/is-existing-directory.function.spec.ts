import { isExistingDirectory } from "./is-existing-directory.function";
import mockFs from "mock-fs";

describe("is-existing-directory", () => {
  beforeAll(() => {
    mockFs({
      "/base": {
        foobar: {},
        note: "just another file",
      },
    });
  });
  it("should return false for non existing directory", () => {
    expect(isExistingDirectory("/base/no-dir")).toBeFalsy();
  });

  it("should return false for path to file", () => {
    expect(isExistingDirectory("/base/note")).toBeFalsy();
  });

  it("should return true for directory", () => {
    expect(isExistingDirectory("/base/foobar")).toBeTruthy();
  });
  afterAll(mockFs.restore);
});
