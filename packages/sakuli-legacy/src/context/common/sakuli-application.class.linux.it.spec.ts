import {TestExecutionContext} from "@sakuli/core";
import {SimpleLogger} from "@sakuli/commons";
import {createApplicationClass} from "./sakuli-application.class";

describe("Application", () => {
    it("should open gnome-calculator", async () => {
        // GIVEN
        const application = "gnome-calculator";
        const ApplicationImpl = createApplicationClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new ApplicationImpl(application);

        // WHEN

        // THEN
        await expect(SUT.open()).resolves.not.toThrow();
        await expect(SUT.close()).resolves.not.toThrow();
    });

    it("should open gnome-calculator with a startup delay", async () => {
        // GIVEN
        const application = "gnome-calculator";
        const ApplicationImpl = createApplicationClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new ApplicationImpl(application);
        const startupDelay = 3;
        SUT.setSleepTime(startupDelay);

        // WHEN
        const start = Date.now();
        await SUT.open();
        const end = Date.now();

        // THEN
        expect(end - start).toBeGreaterThanOrEqual(startupDelay * 1000);
        await expect(SUT.close()).resolves.not.toThrow();
    });

    it("should return correct application name", async () => {
        // GIVEN
        const application = "gnome-calculator";
        const ApplicationImpl = createApplicationClass(new TestExecutionContext(new SimpleLogger()));
        const SUT = new ApplicationImpl(application);

        // WHEN

        // THEN
        expect(SUT.getName()).toEqual(application);
    });
});
