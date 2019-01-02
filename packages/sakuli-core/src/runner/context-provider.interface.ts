import { Project } from "../loader/model";

export interface ContextProvider<T = any> {

    tearUp(project: Project): void;
    tearDown(): void;
    getContext():T


    /**
     *
     * onProject(p: Project)
     * beforeExecution(p: Project)
     * beforeRunFile(file: TestFile)
     * afterRunFile(file: TestFile)
     *
     */
}