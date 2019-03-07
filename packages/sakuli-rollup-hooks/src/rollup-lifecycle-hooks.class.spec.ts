import {RollupLifecycleHooks} from "./rollup-lifecycle-hooks.class";
import {join} from "path";

describe('RollupLifecycleHooks', () => {

    it('should create a bundle from index.js file', async () => {
        const hooks = new RollupLifecycleHooks();
        const o = await hooks.readFileContent({
            path: 'index.js'
        }, {
            rootDir: join(__dirname, '__mock__'),
            testFiles: []
        });
        expect(o.trim().startsWith("(function () {"));
        expect(o).toContain("const pi = 3.4");
        expect(o).toContain("console.log(pi)");
        return expect(o.trim().endsWith("}())"));
    });
});