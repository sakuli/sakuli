import {Project, TestExecutionContext} from "@sakuli/core";
import {SimpleLogger} from "@sakuli/commons";
import {createApplicationClass} from "./sakuli-application.class";
import {Application} from "./application.interface";
import {prepareContext} from "../actions/__mocks__/prepare-context.function";

describe("Application", () => {
    const application = "/Applications/Insomnia.app/Contents/MacOS/Insomnia";
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

    it("should kill calculator", async () => {
        // GIVEN
        const ApplicationImpl = createApplicationClass(ctx, mockProject);
        const SUT = new ApplicationImpl(application);
        await SUT.open();

        // WHEN
        const testAction = () => SUT.kill();

        // THEN
        await expect(testAction()).resolves.not.toThrow();
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

    it("should not update startupDelay for values < 0", async () => {
        // GIVEN
        const ApplicationImpl = createApplicationClass(ctx, mockProject);
        const SUT = new ApplicationImpl(application);
        const startupDelay = -3;

        // WHEN
        SUT.setSleepTime(startupDelay);
        const start = Date.now();
        await SUT.open();
        const end = Date.now();

        // THEN
        expect(end - start).toBeLessThan(1000);
        await expect(SUT.close()).resolves.not.toThrow();
    });

    it("should return correct application name", () => {
        // GIVEN
        const ApplicationImpl = createApplicationClass(ctx, mockProject);
        const SUT = new ApplicationImpl(application);

        // WHEN
        const result = SUT.getName();

        // THEN
        expect(result).toEqual(application);
    });

    it("should only return the escaped application name without parameters", () => {
        // GIVEN
        const applicationName = "/path/to/my\\ escaped/application\\ name";
        const parameters = "--withParam one --andParam two";
        const ApplicationImpl = createApplicationClass(ctx, mockProject);
        const SUT = new ApplicationImpl(`${applicationName} ${parameters}`);
        const expectedName = "/path/to/my escaped/application name";

        // WHEN
        const result = SUT.getName();

        // THEN
        expect(result).toEqual(expectedName);
    });

    it("should throw on not implemented method 'focus'", async () => {
        // GIVEN
        const ApplicationImpl = createApplicationClass(ctx, mockProject);
        const SUT = new ApplicationImpl(application);

        // WHEN
        const testAction = () => SUT.focus();

        // THEN
        await expect(testAction()).rejects.toThrowError("Not Implemented");
    });

    it("should throw on not implemented method 'focusWindow'", async () => {
        // GIVEN
        const ApplicationImpl = createApplicationClass(ctx, mockProject);
        const SUT = new ApplicationImpl(application);

        // WHEN
        const testAction = () => SUT.focusWindow(0);

        // THEN
        await expect(testAction()).rejects.toThrowError("Not Implemented");
    });
});