import {RollupLifecycleHooks} from "./rollup-lifecycle-hooks.class";
import {join} from "path";
import {Project, TestExecutionContext} from "@sakuli/core";
import {mockPartial} from "sneer";

describe('RollupLifecycleHooks', () => {

    let project: Project;
    beforeEach(() => {
        project = mockPartial<Project>({
            rootDir: join(__dirname, '__mock__'),
            testFiles: []
        });
    });

    it('should create a bundle from index.js file', async () => {
        const hooks = new RollupLifecycleHooks();
        const o = await hooks.readFileContent({
            path: 'index.js',
        }, project);
        expect(o.trim().startsWith("(function () {"));
        expect(o).toContain("const pi = 3.4");
        expect(o).toContain("console.log(pi)");
        return expect(o.trim().endsWith("}())"));
    });

    it('should add native node modules as globals to context', async () => {
        const ctx = mockPartial<TestExecutionContext>({});
        const hooks = new RollupLifecycleHooks();
        await hooks.readFileContent({
            path: 'with-native.js'
        }, project);

        await expect(hooks.requestContext(ctx, project)).resolves.toEqual(expect.objectContaining({
            'http': expect.anything(),
            'fs': expect.anything()
        }))
    });

    it('should add typescript plugin if file extension is .ts', async () => {
        const hooks = new RollupLifecycleHooks();
        await hooks.readFileContent({
            path: 'ts.ts'
        }, project);

    });

    it('should add native node modules as globals to context with typescript', async () => {
        const ctx = mockPartial<TestExecutionContext>({});
        const hooks = new RollupLifecycleHooks();
        await hooks.readFileContent({
            path: 'ts/index.ts'
        }, project);

        await expect(hooks.requestContext(ctx, project)).resolves.toEqual(expect.objectContaining({
            'http': expect.anything(),
            'fs': expect.anything()
        }))
    });

    it('should error when file has typescript errors', async () => {
        const hooks = new RollupLifecycleHooks();

        await expect(hooks.readFileContent({
            path: 'ts/error.ts'
        }, project)).rejects.toEqual(expect.anything());

    });

});