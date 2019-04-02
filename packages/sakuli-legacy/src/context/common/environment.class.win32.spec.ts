import {Environment} from "./environment.class";

describe("Environment", () => {
    it("should return true for isWindows", () => {
        // GIVEN
        const SUT = new Environment();

        // WHEN
        const result = SUT.isWindows();

        // THEN
        expect(result).toBeTruthy();
    });

    it("should return false for isLinux", () => {
        // GIVEN
        const SUT = new Environment();

        // WHEN
        const result = SUT.isLinux();

        // THEN
        expect(result).toBeFalsy();
    });

    it("should return false for isDarwin", () => {
        // GIVEN
        const SUT = new Environment();

        // WHEN
        const result = SUT.isDarwin();

        // THEN
        expect(result).toBeFalsy();
    });

    it("should return 'win32'", () => {
        // GIVEN
        const SUT = new Environment();

        // WHEN
        const result = SUT.getOsIdentifier();

        // THEN
        expect(result).toEqual("win32");
    });

    it("should contain 'Windows'", async () => {
        // GIVEN
        const SUT = new Environment();

        // WHEN
        const result = await SUT.runCommand("systeminfo");

        // THEN
        expect(result.getExitCode()).toEqual(0);
        expect(result.getOutput()).toContain("Windows");
    });
});