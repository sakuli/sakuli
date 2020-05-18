import { promises as fs } from "fs";
import { join, sep } from "path";
import { EOL, homedir } from "os";
import { npmGlobalTask } from "./npm-global-task.function";
import rimraf = require("rimraf");

jest.mock("os", () => ({
  homedir: jest.fn(),
}));
const { tmpdir } = jest.requireActual("os");

describe("npmGlobalTask", () => {
  let homeDirMockPath: string;
  beforeEach(async () => {
    homeDirMockPath = await fs.mkdtemp(`${tmpdir()}${sep}`);
    (<jest.Mock>homedir).mockReturnValue(homeDirMockPath);
  });

  it("should add registry with license key to .npmrc", async () => {
    // GIVEN
    const task = npmGlobalTask("abcdefg");

    // WHEN
    await task();

    // THEN
    const npmRcContent = await fs
      .readFile(join(homeDirMockPath, ".npmrc"))
      .then((buf) => buf.toString());
    expect(npmRcContent).toContain("//registry.npmjs.org/:_authToken=abcdefg");
    expect(npmRcContent.endsWith(EOL)).toBeTruthy();
  });

  it("should append registry with license key to existing .npmrc", async () => {
    // GIVEN
    await fs.writeFile(join(homeDirMockPath, ".npmrc"), "# something here");
    const task = npmGlobalTask("abcdefg");

    // WHEN
    await task();

    // THEN
    const npmRcContent = await fs
      .readFile(join(homeDirMockPath, ".npmrc"))
      .then((buf) => buf.toString());
    expect(npmRcContent).toContain("# something here");
    expect(npmRcContent).toContain("//registry.npmjs.org/:_authToken=abcdefg");
  });

  afterEach(async () => {
    rimraf.sync(homeDirMockPath);
  });
});
