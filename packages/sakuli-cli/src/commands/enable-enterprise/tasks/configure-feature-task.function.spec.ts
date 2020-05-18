import { configureFeatureTask } from "./configure-feature-task.function";
import { promises as fs } from "fs";
import { join, sep } from "path";
import { tmpdir } from "os";
import rimraf = require("rimraf");

describe("configureFeatureTask", () => {
  let fsRoot: string;
  beforeEach(async () => {
    fsRoot = await fs.mkdtemp(`${tmpdir()}${sep}`);
  });

  afterEach(async () => {
    rimraf.sync(fsRoot);
  });

  it("should write configuration to sakuli.properties", async () => {
    // GIVEN
    const task = configureFeatureTask(
      {
        KEY: { isComment: false, value: "value" },
      },
      fsRoot
    );

    // WHEN
    await task();
    const propContent = await fs
      .readFile(join(fsRoot, "sakuli.properties"))
      .then((buf) => buf.toString());
    // THEN
    expect(propContent).toContain("KEY=value");
  });

  it("should append configuration when file has contents", async () => {
    // GIVEN
    await fs.writeFile(join(fsRoot, "sakuli.properties"), "EXISTING=value\n");
    const task = configureFeatureTask(
      {
        KEY: { isComment: false, value: "value" },
      },
      fsRoot
    );

    // WHEN
    await task();
    const propContent = await fs
      .readFile(join(fsRoot, "sakuli.properties"))
      .then((buf) => buf.toString());
    // THEN
    expect(propContent).toContain("EXISTING=value");
    expect(propContent).toContain("KEY=value");
  });
});
