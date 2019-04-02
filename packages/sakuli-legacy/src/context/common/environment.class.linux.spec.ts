import {Environment} from "./environment.class";

describe("Environment", () => {
    it("should return false for isWindows", () => {
        // GIVEN
        const SUT = new Environment();

        // WHEN
        const result = SUT.isWindows();

        // THEN
        expect(result).toBeFalsy();
    });

    it("should return true for isLinux", () => {
        // GIVEN
        const SUT = new Environment();

        // WHEN
        const result = SUT.isLinux();

        // THEN
        expect(result).toBeTruthy();
    });

    it("should return false for isDarwin", () => {
        // GIVEN
        const SUT = new Environment();

        // WHEN
        const result = SUT.isDarwin();

        // THEN
        expect(result).toBeFalsy();
    });

    it("should return 'linux'", () => {
        // GIVEN
        const SUT = new Environment();

        // WHEN
        const result = SUT.getOsIdentifier();

        // THEN
        expect(result).toEqual("linux");
    });

    it("should return 'Linux'", async () => {
        // GIVEN
        const SUT = new Environment();

        // WHEN
        const result = await SUT.runCommand("uname");

        // THEN
        expect(result.getExitCode()).toEqual(0);
        expect(result.getOutput()).toEqual("Linux");
    });
});