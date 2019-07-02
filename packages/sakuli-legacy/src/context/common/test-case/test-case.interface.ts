export interface NewableTestCase {
    new(
        caseId?: string,
        warningTime?: number,
        criticalTime?: number,
        _imagePath?: string[]
    ): TestCase;
}

export interface TestCase {
    readonly caseId?: string;
    readonly warningTime: number;
    readonly criticalTime: number;
    _imagePaths: string[];

    addImagePaths(...paths: string[]): void;

    endOfStep(
        stepName: string,
        warning?: number,
        critical?: number,
        forward?: boolean
    ): void;

    handleException<E extends Error>(e: E): Promise<void>;

    getLastUrl(): string;

    saveResult(forward?: boolean): void;

    getID(): string;

    getTestCaseFolderPath(): any;

    getTestSuiteFolderPath(): any;

    throwException(message: string, screenshot?: boolean): Promise<void>;
}