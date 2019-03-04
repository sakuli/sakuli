import {RollupLifecycleHooks} from "./rollup-lifecycle-hooks.class";
import mockFs from 'mock-fs';
import {join} from "path";

describe('RollupLifecycleHooks', () => {

    beforeEach(() => {

    });
    afterEach(() => {
     //   mockFs.restore();
    });

    it('should ', async () => {
        const hooks = new RollupLifecycleHooks();
        const o = await hooks.readFileContent({
            path: './__mock__/test.js'
        }, {
            rootDir: '',
            testFiles: []
        });
        return expect(true).toBeTruthy();
    });
});