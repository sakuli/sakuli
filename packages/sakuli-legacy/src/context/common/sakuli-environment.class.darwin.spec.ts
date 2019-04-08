import {createEnvironmentClass} from "./sakuli-environment.class";
import {Environment} from "./environment.interface";
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

    it("should return false for isLinux", () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new EnvironmentImpl();

        // WHEN
        const result = SUT.isLinux();

        // THEN
        expect(result).toBeFalsy();
    });

    it("should return true for isDarwin", () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new EnvironmentImpl();

        // WHEN
        const result = SUT.isDarwin();

        // THEN
        expect(result).toBeTruthy();
    });

    it("should return 'darwin'", () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new EnvironmentImpl();

        // WHEN
        const result = SUT.getOsIdentifier();

        // THEN
        expect(result).toEqual("darwin");
    });

    it("should return 'Darwin'", async () => {
        // GIVEN
        const EnvironmentImpl = createEnvironmentClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new EnvironmentImpl();

        // WHEN
        const result = await SUT.runCommand("uname", false);

        // THEN
        expect(result.getExitCode()).toEqual(0);
        expect(result.getOutput()).toEqual("Darwin");
    });
});