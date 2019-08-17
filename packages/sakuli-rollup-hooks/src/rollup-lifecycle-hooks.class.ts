import {Project, TestExecutionContext, TestExecutionLifecycleHooks} from "@sakuli/core";
import {TestFile} from "@sakuli/core/dist/loader/model/test-file.interface";
import {Plugin, rollup} from "rollup";
import rollupTsPlugin from 'rollup-plugin-typescript2';
import {extname, isAbsolute, join} from "path";
import { Maybe } from "../../sakuli-commons/dist";

export class RollupLifecycleHooks implements TestExecutionLifecycleHooks {

    private imports: string[] = [];
    async readFileContent(file: TestFile, project: Project): Promise<string> {
        const filePath = isAbsolute(project.rootDir)
            ? join(project.rootDir, file.path)
            : join(process.cwd(), project.rootDir, file.path);

        const plugins: Plugin[] = [];
        const extName = extname(filePath);
        if(extName === '.ts' || extName === '.tsx') {
            const tsconfig: Maybe<string> = project.get('tsconfig');
            plugins.push(rollupTsPlugin(<any>{
                ...(tsconfig ? {tsconfig} : {}),
                tsconfigOverride: {
                    compilerOptions: {
                        module: 'ESNext',
                        target: 'ES2017'
                    },
                },
                clean: true,
            }));
        }
        const bundle = await rollup({
            input: filePath,
            plugins
        });

        const {output} = await bundle.generate({
            format: 'commonjs',
            sourcemap: true,
            file: 'bundle-rollup.js',
        });
        const [rollupOutput] = output;
        this.imports = rollupOutput.imports;
        console.log(rollupOutput.code);
        return Promise.resolve(rollupOutput.code);
    }

    async requestContext(testExecutionContext: TestExecutionContext, project: Project): Promise<Record<string, any>> {
       return ({require});
    }

}
