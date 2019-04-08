import { Project } from "./model";

export interface ProjectLoader {
    /**
     * 
     * @param project
     */
    load(project: Project): Promise<Project>;
}