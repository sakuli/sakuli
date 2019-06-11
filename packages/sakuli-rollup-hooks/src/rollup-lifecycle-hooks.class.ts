import {Project, TestExecutionContext, TestExecutionLifecycleHooks} from "@sakuli/core";
import {TestFile} from "@sakuli/core/dist/loader/model/test-file.interface";
import {rollup} from "rollup";
import {isAbsolute, join} from "path";


export class RollupLifecycleHooks implements TestExecutionLifecycleHooks {

    private imports: string[] = [];
    async readFileContent(file: TestFile, project: Project): Promise<string> {
        const filePath =  isAbsolute(project.rootDir)
            ? join(project.rootDir, file.path)
            : join(process.cwd(), project.rootDir, file.path);

        const bundle = await rollup({
            input: filePath,
        });
        const {output} = await bundle.generate({
            format: 'iife',
            sourcemap: true,
            file: 'bundle-rollup.js',
        });
        const [rollupOutput] = output;
        this.imports = rollupOutput.imports;
        return Promise.resolve(rollupOutput.code);
    }

    requestContext(testExecutionContext: TestExecutionContext, project: Project): Promise<Record<string, any>> {
        return Promise.resolve(this.imports.reduce((ctx, mod) => ({...ctx, [mod]: require(mod)}), {}));
    }

}