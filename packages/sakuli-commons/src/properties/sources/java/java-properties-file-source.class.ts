import {createPropertyReader} from "./create-properties-reader.function";
import {PropertySource, PropertyMap} from "../../model";
import {Value} from "properties-reader";

export class JavaPropertiesFileSource implements PropertySource {

    constructor(
        readonly files: string[]
    ) {
    }

    async createPropertyMap(): Promise<PropertyMap> {
        const reader = createPropertyReader(this.files);
        const propertyRecord: Record<string, Value> = reader.getAllProperties();
        const get = (key: string) => propertyRecord[key];
        const has = (key: string) => get(key) != null;
        return {get, has};
    }

}