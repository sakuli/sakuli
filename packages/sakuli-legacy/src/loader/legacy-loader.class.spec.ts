import { LegacyLoader } from "./legacy-loader.class";
import { stripIndent } from "common-tags";
import { Project } from "@sakuli/core";
import { promises as fs } from "fs";
import { tmpdir } from "os";
import { join, sep } from "path";
import { JavaPropertiesFileSource } from "@sakuli/commons";

jest.mock("@sakuli/commons", () => {
  const originalModule = jest.requireActual("@sakuli/commons");

  return {
    __esModule: true,
    ...originalModule,
    JavaPropertiesFileSource: jest.fn(() => ({
      createPropertyMap: jest.fn(),
    })),
  };
});

describe("LegacyLoader", () => {
  let tmpDir: string = "";
  describe("with a valid project structure", () => {
    let loader: LegacyLoader;
    let project: Project;
    beforeEach(async () => {
      tmpDir = await fs.mkdtemp(`${tmpdir()}${sep}`);

      await fs.mkdir(join(tmpDir, "path/to/testsuites/suite/case1"), {
        recursive: true,
      });
      await fs.mkdir(join(tmpDir, "path/to/testsuites/suite/case2"), {
        recursive: true,
      });
      await fs.writeFile(
        join(tmpDir, "path/to/testsuites/sakuli.properties"),
        "sakuli.environment.similarity.default=0.99"
      );
      await fs.writeFile(
        join(tmpDir, "path/to/testsuites/suite/testsuite.properties"),
        "testsuite.name=test"
      );
      await fs.writeFile(
        join(tmpDir, "path/to/testsuites/suite/testsuite.suite"),
        stripIndent`
                            case1/sakuli_demo.js http://sahi.example.com/_s_/dyn/Driver_initialized
                            case2/sakuli_demo.js http://sahi.example.com/_s_/dyn/Driver_initialized
                `
      );
      await fs.writeFile(
        join(tmpDir, "path/to/testsuites/suite/case1/sakuli_demo.js"),
        "// Test"
      );
      await fs.writeFile(
        join(tmpDir, "path/to/testsuites/suite/case2/sakuli_demo.js"),
        "// Test"
      );

      loader = new LegacyLoader();
      project = new Project(join(tmpDir, "path/to/testsuites/suite"));
      jest.spyOn(project, "addTestFile");
      jest.spyOn(project, "installPropertySource");
      await loader.load(project);
    });

    it("should add two testfiles", () => {
      expect(project.addTestFile).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          path: "case1/sakuli_demo.js",
        })
      );
      expect(project.addTestFile).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          path: "case2/sakuli_demo.js",
        })
      );
    });

    it("should read sahi file", () => {
      expect(project.testFiles.length).toBe(2);
    });

    it("should install JavaPropertiesFileSource with two property-files", () => {
      expect(JavaPropertiesFileSource).toHaveBeenCalledWith(
        expect.arrayContaining([
          join(tmpDir, "path/to/testsuites/sakuli.properties"),
          join(tmpDir, "path/to/testsuites/suite/testsuite.properties"),
        ])
      );
    });
  });

  it("should throw with missing testsuite.properties", async (done) => {
    let loader: LegacyLoader;
    tmpDir = await fs.mkdtemp(`${tmpdir()}${sep}`);

    await fs.mkdir(join(tmpDir, "path/to/testsuites/suite/case1"), {
      recursive: true,
    });
    await fs.mkdir(join(tmpDir, "path/to/testsuites/suite/case2"), {
      recursive: true,
    });
    await fs.writeFile(
      join(tmpDir, "path/to/testsuites/sakuli.properties"),
      "sakuli.environment.similarity.default=0.99"
    );
    await fs.writeFile(
      join(tmpDir, "path/to/testsuites/suite/testsuite.suite"),
      stripIndent`
                            case1/sakuli_demo.js http://sahi.example.com/_s_/dyn/Driver_initialized
                            case2/sakuli_demo.js http://sahi.example.com/_s_/dyn/Driver_initialized
                `
    );
    await fs.writeFile(
      join(tmpDir, "path/to/testsuites/suite/case1/sakuli_demo.js"),
      "// Test"
    );
    await fs.writeFile(
      join(tmpDir, "path/to/testsuites/suite/case2/sakuli_demo.js"),
      "// Test"
    );

    try {
      loader = new LegacyLoader();
      await loader.load(new Project(join(tmpDir, "path/to/testsuites/suite")));
      done.fail();
    } catch (e) {
      expect(e.message).toContain("testsuite.properties");
      done();
    }
  });

  afterEach(async () => {
    try {
      await fs.unlink(tmpDir);
    } catch (e) {}
  });
});
