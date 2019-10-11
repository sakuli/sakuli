import {RollupLifecycleHooks} from "./rollup-lifecycle-hooks.class";
import {join} from "path";
import {Project, TestExecutionContext} from "@sakuli/core";
import {mockPartial} from "sneer";

describe('RollupLifecycleHooks', () => {

    it('should create a bundle from index.js file', async () => {
        const hooks = new RollupLifecycleHooks();
        const o = await hooks.readFileContent({
            path: 'index.js'
        }, mockPartial<Project>({
            rootDir: join(__dirname, '__mock__'),
            testFiles: []
        }));
        expect(o.trim().startsWith("(function () {"));
        expect(o).toContain("const pi = 3.4");
        expect(o).toContain("console.log(pi)");
        return expect(o.trim().endsWith("}())"));
    });

    it('should c', async () => {
        const ctx = mockPartial<TestExecutionContext>({});
        const project = mockPartial<Project>({
            rootDir: join(__dirname, '__mock__'),
            testFiles: []
        });
        const hooks = new RollupLifecycleHooks();
        await hooks.readFileContent({
            path: 'with-native.js'
        }, project);

        await expect(hooks.requestContext(ctx, project)).resolves.toEqual(expect.objectContaining({
            'http': expect.anything(),
            'fs': expect.anything()
        }))
    });
});