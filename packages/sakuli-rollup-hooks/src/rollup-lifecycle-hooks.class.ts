import {Project, TestExecutionLifecycleHooks} from "@sakuli/core";
import {TestFile} from "@sakuli/core/dist/loader/model/test-file.interface";
import {rollup} from "rollup";
import {isAbsolute, join} from "path";


export class RollupLifecycleHooks implements TestExecutionLifecycleHooks {

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
        return Promise.resolve(rollupOutput.code);
    }

    async useRollup(file: TestFile) {

    }

}