import {Project, TestExecutionContext} from "@sakuli/core";
import {SimpleLogger} from "@sakuli/commons";
import {createApplicationClass} from "./sakuli-application.class";
import {Application} from "./application.interface";
import {prepareContext} from "../actions/__mocks__/prepare-context.function";

describe("Application", () => {

    const application = "/Applications/Calculator.app/Contents/MacOS/Calculator";
    const mockProject = new Project(".");
    let ctx: TestExecutionContext;

    beforeEach(() => {
        ctx = new TestExecutionContext(new SimpleLogger());
        prepareContext(ctx);
    });

    it("should open calculator", async () => {
        // GIVEN
        const ApplicationImpl = createApplicationClass(ctx, mockProject);
        const SUT = new ApplicationImpl(application);

        // WHEN

        // THEN
        await expect(SUT.open()).resolves.not.toThrow();
        await expect(SUT.close()).resolves.not.toThrow();
    });

    it("should open calculator with a startup delay", async () => {
        // GIVEN
        const ApplicationImpl = createApplicationClass(ctx, mockProject);
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
        const ApplicationImpl = createApplicationClass(ctx, mockProject);
        const SUT = new ApplicationImpl(application);

        // WHEN

        // THEN
        expect(SUT.getName()).toEqual(application);
    });
});