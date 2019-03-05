import {RollupLifecycleHooks} from "./rollup-lifecycle-hooks.class";
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
            path: 'test.js'
        }, {
            rootDir: join(process.cwd(), 'src', '__mock__'),
            testFiles: []
        });
        expect(o.trim().startsWith("(function () {"));
        expect(o).toContain("const pi = 3.4");
        expect(o).toContain("console.log(pi)");
        return expect(o.trim().endsWith("}())"));
    });
});