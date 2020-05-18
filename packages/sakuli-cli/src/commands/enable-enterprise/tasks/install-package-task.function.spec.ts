import { installPackageTask } from "./install-package-task.function";
import execa from "execa";

jest.mock("execa", () => jest.fn());

describe("installPackageTask", () => {
  it("should run npm install on given paackage", async () => {
    // GIVEN
    const task = installPackageTask("package");

    // WHEN
    await task();

    // THEN
    expect(execa).toHaveBeenCalledWith("npm", ["i", "package"]);
  });
});
