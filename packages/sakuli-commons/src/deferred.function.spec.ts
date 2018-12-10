import {deferred} from "./deferred.function";

describe('deferred', () => {

    it('should resolve the promise', async done => {
        const def = deferred<string>();
        def.promise
            .then(v => {
                expect(v).toBe('test');
                done();
            })
            .catch(() => {
                done.fail();
            });
        def.resolve('test')
    });

    it('should reject the promise', async done => {
        const def = deferred<string>();
        def.promise
            .then(_ =>{
                done.fail();
            })
            .catch(_ => {
                done();
            });
        def.reject();
    });
});