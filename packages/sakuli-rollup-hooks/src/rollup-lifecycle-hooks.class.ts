import {Project, TestExecutionLifecycleHooks} from "@sakuli/core";
import {TestFile} from "@sakuli/core/dist/loader/model/test-file.interface";
import {rollup} from "rollup";


export class RollupLifecycleHooks implements TestExecutionLifecycleHooks {

    async readFileContent(file: TestFile, project: Project): Promise<string> {
        const rollupOutput = await this.useRollup(file);
        return Promise.resolve(rollupOutput.code);
    }

    async useRollup(file: TestFile) {
        const bundle = await rollup({
            input: file.path,
        });
        const {output} = await bundle.generate({
            format: 'iife',
            sourcemap: true,
            file: 'bundle-rollup.js',
        });
        return output[0];
    }

}