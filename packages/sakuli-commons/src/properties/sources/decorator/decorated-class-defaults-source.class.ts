import { PropertySource, PropertyMap } from "../../model";
import { Type } from "../../../type.interface";
import { getPropertyDecoratorDefinitions } from "../../decorator";

export class DecoratedClassDefaultsSource<T> implements PropertySource {

    constructor(
        readonly type: Type<T>
    ) {
        if (type.prototype.constructor.length) {
            throw Error(`The constructor of ${type.name} must have 0 mandatory parameters but it has ${type.prototype.constructor.length}`)
        }
    }

    async createPropertyMap(): Promise<PropertyMap> {

        const defs = getPropertyDecoratorDefinitions(this.type);
        const instance = new this.type();
        const get = (key: string) => {
            const def = defs.find(def => def.path === key);
            if(def) {
                return instance[def.property as keyof T];
            }
            return;
        }
        const has = (key: string) => {
            return !!get(key);
        }
        return ({get, has});

    }

}
