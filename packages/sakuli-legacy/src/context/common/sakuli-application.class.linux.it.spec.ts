import {TestExecutionContext} from "@sakuli/core";
import {SimpleLogger} from "@sakuli/commons";
import {createApplicationClass} from "./sakuli-application.class";

describe("Application", () => {
    it("should open gnome-calculator", async () => {
        // GIVEN
        const ApplicationImpl = createApplicationClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new ApplicationImpl("gnome-calculator");

        // WHEN

        // THEN
        await expect(SUT.open()).resolves.not.toThrow();
    });

    it("should open gnome-calculator with a startup delay", async () => {
        // GIVEN
        const ApplicationImpl = createApplicationClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new ApplicationImpl("gnome-calculator");
        const startupDelay = 3;
        SUT.setSleepTime(startupDelay);

        // WHEN
        const start = Date.now();
        await SUT.open();
        const end = Date.now();

        // THEN
        expect(end - start).toBeGreaterThanOrEqual(startupDelay * 1000);
    });

    it("should open and close gnome-calculator", async () => {
        // GIVEN
        const ApplicationImpl = createApplicationClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new ApplicationImpl("gnome-calculator");

        // WHEN
        await SUT.open();

        // THEN
        await expect(SUT.close()).resolves.not.toThrow();
    });
});