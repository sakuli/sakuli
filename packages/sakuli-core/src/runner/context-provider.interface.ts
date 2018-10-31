import { Project } from "../loader/model/project.class";

export interface ContextProvider {

    tearUp(project: Project);
    tearDown();
    getContext():any
}