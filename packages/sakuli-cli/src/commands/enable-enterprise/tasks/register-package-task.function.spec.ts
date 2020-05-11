import { promises as fs } from "fs";
import { tmpdir } from "os";
import { join, sep } from "path";
import { registerPackageTask } from "./register-package-task.function";
import rimraf = require("rimraf");

const { objectContaining, arrayContaining } = expect;
describe("registerPackageTask", () => {
  let packageJsonPath: string;

  const mockPackageJson = async (content: object) => {
    await fs.writeFile(
      join(packageJsonPath, "package.json"),
      JSON.stringify(content)
    );
  };

  beforeEach(async () => {
    packageJsonPath = await fs.mkdtemp(`${tmpdir}${sep}`);
  });

  it.each(<[object, string[]][]>[
    [{}, ["package"]],
    [{ sakuli: {} }, ["package"]],
    [{ sakuli: { presetProvider: [] } }, ["package"]],
    [{ sakuli: { presetProvider: ["others"] } }, ["others", "package"]],
  ])(
    "should add 'package' to presetProviders %s",
    async (packageJsonContent, expectedPresets) => {
      await mockPackageJson(packageJsonContent);
      const task = registerPackageTask("package", packageJsonPath);
      await task();

      const packageJson = await fs
        .readFile(join(packageJsonPath, "package.json"))
        .then((buf) => buf.toString())
        .then((content) => JSON.parse(content));
      expect(packageJson).toEqual(
        objectContaining({
          sakuli: objectContaining({
            presetProvider: expectedPresets,
          }),
        })
      );
    }
  );

  afterEach(() => {
    rimraf.sync(packageJsonPath);
  });
});
