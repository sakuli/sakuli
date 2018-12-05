import {JsScriptExecutor} from "./js-script-executor.class";
import {stripIndent} from "common-tags";

declare function getGreeting():void;
describe("JsScriptExecutor", () => {

    it('should execute simple js code', () => {
        const executor = new JsScriptExecutor({});

        executor.execute(`
            const x = 1 + 1;            
        `, {})
    });

    it('should invoke functions from context', () => {
        const executor = new JsScriptExecutor({});
        const context = {
            getGreeting: jest.fn(),
        };
        executor.execute(`
            const greeting = getGreeting('Tim')
        `, context);

        expect(context.getGreeting).toHaveBeenLastCalledWith('Tim');
    });

    it('should change context variables', () => {
        const executor = new JsScriptExecutor({});
        const context = {
            x: 0
        };
        executor.execute(`
            x = 1 + 1
        `, context);

        expect(context.x).toBe(2);
    });

    it('should allow multiple context executions', () => {
        const executor = new JsScriptExecutor({});
        const context = {
            x: 1
        };
        const _ctxX2 = executor.execute(`x += 1`, context);
        expect(_ctxX2.x).toBe(2);
        executor.execute(`x += 1`, _ctxX2);
        expect(_ctxX2.x).toBe(3);
    })


    xit('should make different contexts available in test', () => {
        const executor = new JsScriptExecutor({});
        const context1 = {

        };
        const context2 = {
            getGreeting() {
                return 'Hello'
            },
            sayHello(this: any) {
                return getGreeting() + ' ' +  'Sakuli'
            },
            hello: ''
        };

        const ctx = executor.execute(stripIndent`
            //hello = sayHello();
            console.log(Array)
        `, Object.assign({...context1, ...context2}));
        expect(ctx.greetWithName).toEqual('Hello Sakuli')
    });

});