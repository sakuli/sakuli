import {TestExecutionContext} from "../runner/test-execution-context";
import {SimpleLogger} from "@sakuli/commons";
import {Forwarder} from "./forwarder.interface";
import {mockPartial} from "sneer";
import {Project} from "../loader/model";
import {connectForwarderToTestExecutionContext} from "./connect-forwarder-to-test-execution-context.function";

describe('connectForwarderToTestExecutionContext', () => {
    let ctx: TestExecutionContext;
    const project = new Project('');
    let forwarder: Forwarder;

    beforeEach(() => {
        ctx = new TestExecutionContext(new SimpleLogger());
    });

    describe('full implemented forwarder', () => {
        let teardown: () => Promise<void>;
        beforeEach(async () => {
            forwarder = mockPartial<Forwarder>({
                setup: jest.fn(() => Promise.resolve()),
                tearDown: jest.fn(() => Promise.resolve()),
                forward: jest.fn(() => Promise.resolve()),
                forwardStepResult: jest.fn(() => Promise.resolve()),
                forwardActionResult: jest.fn(() => Promise.resolve()),
                forwardCaseResult: jest.fn(() => Promise.resolve()),
                forwardSuiteResult: jest.fn(() => Promise.resolve()),
            });
            teardown = await connectForwarderToTestExecutionContext(forwarder, ctx, project);

            ctx.startExecution();
            ctx.startTestSuite({id:'suite1'});
            ctx.startTestCase({id: 'case1'});
            ctx.startTestStep({});
            ctx.updateCurrentTestStep({id: 'step1'});
            ctx.endTestStep();
            ctx.startTestStep({id: 'step2'});
            ctx.endTestStep();
            ctx.endTestCase();
            ctx.endTestSuite();
            ctx.endExecution();
        });

        it('should call setup', () => {
            expect(forwarder.setup).toHaveBeenCalledWith(project, ctx.logger);
        });

        it('should call forwardSuiteResult', () => {
            expect(forwarder.forwardSuiteResult).toHaveBeenCalledWith(
                expect.objectContaining({id: 'suite1'}),
                project
            );
        });

        it('should call forwardCaseResult', () => {
            expect(forwarder.forwardCaseResult).toHaveBeenCalledWith(
                expect.objectContaining({id: 'case1'}),
                project
            );
        });

        it('should call forwardStepResult', () => {
            expect(forwarder.forwardStepResult).toHaveBeenCalledWith(
                expect.objectContaining({id: 'step1'}),
                project
            );
            expect(forwarder.forwardStepResult).toHaveBeenCalledWith(
                expect.objectContaining({id: 'step2'}),
                project
            );
        });

        it('should call forward', () => {
            expect(forwarder.forward).toHaveBeenCalledWith(ctx, project);
        });

        it('should call teardown when returned teardown function is invoked', async () => {
            expect(forwarder.tearDown).toHaveBeenCalledTimes(0);
            await teardown();
            expect(forwarder.tearDown).toHaveBeenCalledTimes(1);
        });

    })

});