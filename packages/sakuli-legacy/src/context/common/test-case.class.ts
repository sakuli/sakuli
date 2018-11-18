export class TestCase {
    constructor(
        readonly caseId?: string,
        readonly warningTime: number = 0,
        readonly criticalTime: number = 0,
        readonly imagePaths: string[] = []
    ) {
    }

    addImagePaths(...paths: string[]) {
        this.imagePaths.concat(paths);
    }

    endOfStep(
        stepName: string,
        warning: number = 0,
        critical: number = 0,
        forward: boolean = false
    ) {}

    handleException<E extends Error>(e: E) {

    }

    saveResult() {

    }

    getID() {
        return this.caseId;
    }
}