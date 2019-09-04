import {TestFile} from "./test-file.interface";
import {createPropertyObjectFactory, TemplatedPropertyMap, CascadingPropertyMap, PropertyMap, PropertySource, Type} from "@sakuli/commons";

export class Project implements PropertyMap {
    private cascadingMap = new CascadingPropertyMap();
    private propertyMap = new TemplatedPropertyMap(this.cascadingMap);
    private _testFiles: TestFile[] = [];
    private _installedMaps: number = 0;
    get testFiles(): TestFile[] {
        return this._testFiles;
    }

    constructor(
        readonly rootDir: string
    ) {
    }

    addTestFile(testFile: TestFile) {
        this._testFiles.push(testFile);
    }

    async installPropertySource(source: PropertySource) {
        await this.cascadingMap.installSource(source);
        this._installedMaps++;
    }

    get(key: string) {
        return this.propertyMap.get(key);
    }

    has(key: string) {
        return this.propertyMap.has(key);
    }

    objectFactory<T>(type: Type<T>): T {
        return createPropertyObjectFactory(this)(type);
    }

    get installedMaps () {
        return this._installedMaps;
    }

}
