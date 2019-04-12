import {JsScriptExecutor} from "./js-script-executor.class";
import {stripIndents} from "common-tags";

declare function getGreeting(): void;

describe("JsScriptExecutor", () => {

    it('should execute simple js code', async done => {
        const executor = new JsScriptExecutor({});

        await executor.execute(`
            const x = 1 + 1;            
        `, {});
        done();
    });

    it('should invoke functions from context', async done => {
        const executor = new JsScriptExecutor({filename: 'testfile.js'});
        const context = {
            getGreeting: jest.fn(),
        };
        await executor.execute(`
            const greeting = getGreeting('Tim')
        `, context);

        expect(context.getGreeting).toHaveBeenLastCalledWith('Tim');
        done();
    });

    it('should change context variables', async done => {
        const executor = new JsScriptExecutor({
            filename: 'testfile.js',
        });
        const context = {
            x: 0
        };
        const ctx = await executor.execute(`
            x = 1 + 1            
        `, context);

        expect(ctx.x).toBe(2);
        done();
    });

    it('should allow multiple context executions', async done => {
        const executor = new JsScriptExecutor({filename: 'testfile.js'});
        const context = {
            x: 1
        };
        const _ctxX2 = await executor.execute(`x += 1`, context);
        expect(_ctxX2.x).toBe(2);
        const _ctxX3 = await executor.execute(`x += 1`, _ctxX2);
        expect(_ctxX3.x).toBe(3);
        done();
    });

    it('should wait until async operations are done', async done => {

        const executor = new JsScriptExecutor({
            filename: 'testfile.js',
            waitUntilDone: true
        });
        const context = {
            x: 1,
            sayHello: jest.fn(),
            setTimeout
        };
        const _ctxX = await executor.execute(stripIndents`
           (async () => {
                async function wait(ms) {
                    return new Promise((res, rej) => {
                        setTimeout(res, ms);
                    })
                }            
                x = 5;
                sayHello();
            })().then(done);
        `, context);
        expect(context.sayHello).toHaveBeenCalled();
        expect(_ctxX.x).toBe(5);
        done();
    });

});