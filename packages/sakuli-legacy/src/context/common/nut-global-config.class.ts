class NutGlobalConfig {
    constructor(
        private _confidence: number = 0.99,
        private _imagePaths: string[] = [],
        private readonly defaultConfidence: number = 0.95,
    ) {
    }

    get confidence(): number {
        return this._confidence;
    }

    set confidence(value: number) {
        this._confidence = value;
    }

    resetConfidence() {
        this.confidence = this.defaultConfidence;
    }

    get imagePaths(): string[] {
        return this._imagePaths;
    }

    set imagePaths(value: string[]) {
        this._imagePaths = value;
    }

    addImagePath(...newPath: string[]) {
        this._imagePaths.concat(newPath);
    }
}

const theConfig = new NutGlobalConfig();

export default theConfig;
