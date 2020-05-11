import mockFs from "mock-fs";
import { loadBootstrapOptions } from "./load-bootstrap-options.function";

describe("loadBootstrapOptions", () => {
  it("should load from package json file", async (done) => {
    mockFs({
      root: {
        "package.json": JSON.stringify({
          sakuli: {
            presetProvider: ["p1", "p2"],
          },
        }),
      },
    });
    const opts = await loadBootstrapOptions("root/");
    expect(opts.presetProvider.length).toBe(2);
    expect(opts.presetProvider).toContain("p1");
    expect(opts.presetProvider).toContain("p2");
    done();
  });

  it("should load defaults when missing config", async (done) => {
    mockFs({
      root: {},
    });
    const opts = await loadBootstrapOptions("root/");
    expect(opts.presetProvider.length).toBe(1);
    expect(opts.presetProvider[0]).toBe("@sakuli/legacy");
    done();
  });

  afterEach(() => {
    mockFs.restore();
  });
});
