import { readJson } from "../read-json.function";
import { containsTypescript } from "./contains-typescript.function";

jest.mock("../read-json.function.ts", () => {
  return {
    readJson: jest.fn((path: string) => {
      if (path.endsWith("/typescript/package.json")) {
        return Promise.resolve({
          dependencies: {
            typescript: "1.2.3",
          },
        });
      }
      if (path.endsWith("/noTypescript/package.json")) {
        return Promise.resolve({
          dependencies: {
            sakuli: "1.2.3",
          },
        });
      }
      if (path.endsWith("/devTypescript/package.json")) {
        return Promise.resolve({
          dependencies: {
            sakuli: "1.2.3",
          },
          devDependencies: {
            typescript: "1.2.3",
          },
        });
      }
      if (path.endsWith("/depTypescript/package.json")) {
        return Promise.resolve({
          dependencies: {
            typescript: "1.2.3",
          },
          devDependencies: {
            sakuli: "1.2.3",
          },
        });
      }
      if (path.endsWith("/noDepAndDevTypescript/package.json")) {
        return Promise.resolve({
          dependencies: {
            sakuli: "1.2.3",
          },
          devDependencies: {
            sakuli: "1.2.3",
          },
        });
      }
      if (path.endsWith("/invalid/package.json")) {
        return Promise.reject();
      }
      if (path.endsWith("/missing-dependencies-key/package.json")) {
        return Promise.resolve({});
      }
    }),
  };
});

describe("getInstalledPresets", () => {
  it("should return true for existing typescript", async () => {
    const dependencies = await containsTypescript("/typescript");
    expect(readJson).toHaveBeenCalledWith("/typescript/package.json");
    expect(dependencies).toBeTruthy();
  });

  it("should return false for non-existing typescript", async () => {
    const dependencies = await containsTypescript("/noTypescript");
    expect(readJson).toHaveBeenCalledWith("/noTypescript/package.json");
    expect(dependencies).toBeFalsy();
  });

  it("should return true for existing typescript in devDependencies", async () => {
    const dependencies = await containsTypescript("/devTypescript");
    expect(readJson).toHaveBeenCalledWith("/devTypescript/package.json");
    expect(dependencies).toBeTruthy();
  });

  it("should return true for existing typescript in dependencies", async () => {
    const dependencies = await containsTypescript("/depTypescript");
    expect(readJson).toHaveBeenCalledWith("/depTypescript/package.json");
    expect(dependencies).toBeTruthy();
  });

  it("should return false for non-existing typescript in devDependency", async () => {
    const dependencies = await containsTypescript("/noDepAndDevTypescript");
    expect(readJson).toHaveBeenCalledWith(
      "/noDepAndDevTypescript/package.json"
    );
    expect(dependencies).toBeFalsy();
  });

  it("should return false when json doesn't have dependecies property", async () => {
    const dependencies = await containsTypescript("/missing-dependencies-key");
    expect(readJson).toHaveBeenCalledWith(
      "/missing-dependencies-key/package.json"
    );
    expect(dependencies).toBeFalsy();
  });

  it("should return false when readJson throws", async () => {
    const dependencies = await containsTypescript("/invalid");
    expect(readJson).toHaveBeenCalledWith("/invalid/package.json");
    expect(dependencies).toBeFalsy();
  });
});
