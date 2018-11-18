import { Project } from "../loader/model/project.interface";

export interface ContextProvider<T = any> {

    tearUp(project: Project): void;
    tearDown(): void;
    getContext():T
}