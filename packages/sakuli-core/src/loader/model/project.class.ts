import {TestFile} from "./test-file.interface";
import {CascadingPropertyMap, PropertyMap, PropertySource, Type} from "@sakuli/commons";
import {createPropertyObjectFactory} from "@sakuli/commons/dist/properties/decorator/create-property-object-factory.function";
import {TemplatedPropertyMap} from "@sakuli/commons/dist/properties/sources/templated-property-source.class";

export class Project implements PropertyMap {
    private cascadingMap = new CascadingPropertyMap();
    private propertyMap = new TemplatedPropertyMap(this.cascadingMap);
    private _testFiles: TestFile[] = [];
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

}
