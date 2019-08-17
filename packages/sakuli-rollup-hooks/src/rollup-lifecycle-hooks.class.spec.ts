import {RollupLifecycleHooks} from "./rollup-lifecycle-hooks.class";
import {join, resolve} from "path";
import {Project, TestExecutionContext} from "@sakuli/core";
import {mockPartial} from "sneer";

describe('RollupLifecycleHooks', () => {

    let project: Project;
    beforeEach(() => {
        const rootDir = join(__dirname, '..', '__mock__');
        project = mockPartial<Project>({
            rootDir,
            testFiles: [],
            get(key: string) {
                return (<Record<string, string>>({
                    "tsconfig": join(rootDir, 'tsconfig.spec.json')
                }))[key]
            }
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
    it('should add typescript plugin if file extension is .ts', async () => {
        const hooks = new RollupLifecycleHooks();
        await hooks.readFileContent({
            path: 'ts/index.ts'
        }, project);

    });
    it('should error when file has typescript errors', async () => {
        const hooks = new RollupLifecycleHooks();

        await expect(hooks.readFileContent({
            path: 'ts/error.ts'
        }, project)).rejects.toEqual(expect.anything());

    });

});
