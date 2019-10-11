import {createPropertyReader} from "./create-properties-reader.function";
import {PropertyMap, PropertySource} from "../../model";
import {ObjectMap} from "../../maps/object-map.class";

export class JavaPropertiesFileSource implements PropertySource {

    constructor(
        readonly files: string[]
    ) {
    }

    async createPropertyMap(): Promise<PropertyMap> {
        const reader = createPropertyReader(this.files);
        const propsObject = reader.path();
        return new ObjectMap(propsObject);
    }

}
