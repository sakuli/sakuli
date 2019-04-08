import {createEnvironmentClass} from "./sakuli-environment.class";
import {TestExecutionContext} from "@sakuli/core";
import {SimpleLogger} from "@sakuli/commons";

describe("Environment", () => {
    it("should return false for isWindows", () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new EnvironmentImpl();

        // WHEN
        const result = SUT.isWindows();

        // THEN
        expect(result).toBeFalsy();
    });

    it("should return true for isLinux", () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new EnvironmentImpl();

        // WHEN
        const result = SUT.isLinux();

        // THEN
        expect(result).toBeTruthy();
    });

    it("should return false for isDarwin", () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new EnvironmentImpl();

        // WHEN
        const result = SUT.isDarwin();

        // THEN
        expect(result).toBeFalsy();
    });

    it("should return 'linux'", () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new EnvironmentImpl();

        // WHEN
        const result = SUT.getOsIdentifier();

        // THEN
        expect(result).toEqual("linux");
    });

    it("should return 'Linux'", async () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new EnvironmentImpl();

        // WHEN
        const result = await SUT.runCommand("uname");

        // THEN
        expect(result.getExitCode()).toEqual(0);
        expect(result.getOutput()).toEqual("Linux");
    });
});