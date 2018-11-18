import { Testsuite } from "./model/testsuite.class";
import { Project } from "./model/project.interface";

export interface ProjectLoader {
    /**
     * 
     * @param path 
     */
    load(path: string): Promise<Project | null>;
}