import { Testsuite } from "./model/testsuite.class";
import { Project } from "./model/project.class";

export interface ProjectLoader {
    /**
     * 
     * @param path 
     */
    load(path: string): Promise<Project | null>;
}