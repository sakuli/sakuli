import {Project, TestExecutionLifecycleHooks} from "@sakuli/core";
import {TestFile} from "@sakuli/core/dist/loader/model/test-file.interface";
import {rollup, Plugin as RollupPlugin} from "rollup";
import nodeResolve from 'rollup-plugin-node-resolve';
import {inspect} from "util";
import {join} from "path";
import * as ts from 'typescript'
import {readFileSync} from "fs";

export class RollupLifecycleHooks implements TestExecutionLifecycleHooks {

    async readFileContent(file: TestFile, project: Project): Promise<string> {

        var content = readFileSync(file.path, "utf-8");

        var compilerOptions: ts.CompilerOptions = {
            allowJs: true,
            outFile: 'bundle.js',
            module: ts.ModuleKind.AMD,
        };

        //await this.useCreateProgram(file, content, compilerOptions);
        //await this.useTranspileModule(file, content, compilerOptions);
        await this.useRollup(file);

        /*

        */
        return Promise.resolve('');
    }

    async useRollup(file :TestFile) {
        const bundle = await rollup({
            input: file.path,

            plugins: [
                nodeResolve({
                    browser: true
                }) as RollupPlugin
            ]

        });
        const {output}  = await bundle.generate({
            format: 'iife',
            file: 'bundle-rollup.js'
        });

        console.log(output)
    }

    async useCreateProgram(file: TestFile, content: string, compilerOptions: ts.CompilerOptions) {
        const prog = ts.createProgram([
            join(process.cwd(), 'src', '__mock__')
        ], compilerOptions);
        const sources = prog.getSourceFiles();

        console.log(prog.emit(
          //  ts.createSourceFile(file.path, content, ts.ScriptTarget.Latest, true)
        ));

        sources.forEach((sf: ts.SourceFile) => {
            console.log(inspect({
                name: sf.fileName,
                //text: sf.text
            }, false, null, true));
        });

    }

    async useTranspileModule(file: TestFile, content: string, compilerOptions: ts.CompilerOptions) {
        var res1 = ts.transpileModule(content, {
            compilerOptions: compilerOptions,
            fileName: file.path,
            moduleName: file.path.split('/').pop()
        });
        console.log(res1.outputText);
    }

}