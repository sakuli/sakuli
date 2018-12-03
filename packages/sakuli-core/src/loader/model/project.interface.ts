import { TestFile } from "./test-file.interface";

export interface Project {
    rootDir: string,
    testFiles: TestFile[]
}