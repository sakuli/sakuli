import {PropertyMap} from "../model";
import {Type} from "../../type.interface";
import {getPropertyDecoratorDefinitions, PropertyDecoratorDefinition} from "./properties.decorator";

/**
 *
 * @param propertyMap
 * @return a mapping function for Constructors of a decorated class which is bound to the propertyMap
 */
export function createPropertyObjectFactory(propertyMap: PropertyMap) {
    return <T>(cls: Type<T>): T => {
        if (cls.prototype.constructor.length) {
            throw Error(`The constructor of ${cls.name} must have 0 mandatory parameters but it has ${cls.prototype.constructor.length}`)
        }
        const propertyDefinitions = getPropertyDecoratorDefinitions(cls);
        const dataObject = propertyDefinitions.reduce((agg: object, def: PropertyDecoratorDefinition) => {
            if (propertyMap.has(def.path)) {
                return {...agg, [def.property]: def.reader(propertyMap.get(def.path))};
            } else {
                return agg;
            }

        }, {});

        return Object.assign(new cls(), dataObject);
    }
}