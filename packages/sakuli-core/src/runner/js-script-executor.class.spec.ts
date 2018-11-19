import { JsScriptExecutor } from "./js-script-executor.class";

describe("JsScriptExecutor", () => {

    it('should execute simple js code', () => {
        const executor = new JsScriptExecutor({});

        executor.execute(`
            const x = 1 + 1;            
        `, {})
    })

    it('should invoke functions from context', () => {
        const executor = new JsScriptExecutor({});
        const context = {
            getGreeting: jest.fn()
        }
        executor.execute(`
            const greeting = getGreeting('Tim')
        `, context);

        expect(context.getGreeting).toHaveBeenLastCalledWith('Tim');
    })

    it('should change context variables', () => {
        const executor = new JsScriptExecutor({});
        const context = {
            x: 0
        }
        executor.execute(`
            x = 1 + 1
        `, context);

        expect(context.x).toBe(2);
    })

    it('should allow multiple context executions', () => {
        const executor = new JsScriptExecutor({});
        const context = {
            x: 1
        }
        const _ctxX2 = executor.execute(`x += 1`, context);
        expect(_ctxX2.x).toBe(2);
        const _ctxX3 = executor.execute(`x += 1`, _ctxX2);
        expect(_ctxX2.x).toBe(3);

    })

})