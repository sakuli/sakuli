import {DeferredStack} from "./deferred-stack.class";

describe('DeferredStack', () => {

    it('should count all deferreds', () => {
        const dStack = new DeferredStack();
        dStack.put();
        dStack.put();
        dStack.put();
        expect(dStack.size).toBe(3);
    });

    it('should resolve after stack resolved', async done => {
        const dStack = new DeferredStack();
        dStack.put();
        dStack.put();
        dStack.put();
        dStack.resolved().then(() => {
            done()
        })
        dStack.pop();
        dStack.pop();
        dStack.pop();
    });

});