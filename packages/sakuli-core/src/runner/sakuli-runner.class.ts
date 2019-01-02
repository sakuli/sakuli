import {Project} from "../loader/model";
import {ContextProvider} from "./context-provider.interface";
import {TestScriptExecutor} from "./test-script-executor.interface";
import {readFileSync} from "fs";
import {JsScriptExecutor} from "./js-script-executor.class";
import {join, resolve} from "path";
import {Sakuli} from "../sakuli.class";
import {ifPresent} from "@sakuli/commons";

export class SakuliRunner {

    constructor(
        readonly contextProvider: ContextProvider[],
        readonly testFileExecutor: TestScriptExecutor = new JsScriptExecutor
    ) {
    }

    /**
     * Tears up all context providers, merges their results of getContext and pass this result to the testFile Executor
     * Tears down all service providers after execution of each testFile
     *
     * @param project The Project Structure found by a Project loader
     * @returns a merged object from all provided contexts after their execution
     */
    async execute(project: Project): Promise<any> {
        Sakuli().testExecutionContext.startExecution();
        this.contextProvider.forEach(cp => cp.tearUp(project));
        const context = this.createContext();
        let result = {};
        for (const testFile of project.testFiles) {
            const testFileContent = readFileSync(join(project.rootDir, testFile.path));
            const [suiteId] = testFile.path.split('/');
            Sakuli().testExecutionContext.startTestSuite({id: suiteId});
            try {
                const executor = new JsScriptExecutor({
                    filename: resolve(join(project.rootDir, testFile.path)),
                    waitUntilDone: true
                });
                const resultCtx = await executor.execute(testFileContent.toString(), context);
                const id = ifPresent(Sakuli().testExecutionContext.getCurrentTestCase(),
                        ctc => ctc.id,
                    () => testFile.path.split('/').pop()
                );
                Sakuli().testExecutionContext.updateCurrentTestCase({id});
                result = {...result, ...resultCtx};
            } catch (error) {
                Sakuli().testExecutionContext.updateCurrentTestSuite({error});
            }
            Sakuli().testExecutionContext.endTestSuite();
        }
        Sakuli().testExecutionContext.endExecution();
        await Sakuli().testExecutionContext.allEntitiesFinished;
        this.contextProvider.forEach(cp => cp.tearDown());
        return result;
    }

    private createContext() {
        return this.contextProvider.reduce((ctx, provider) => ({...ctx, ...provider.getContext()}), {});
    }

}