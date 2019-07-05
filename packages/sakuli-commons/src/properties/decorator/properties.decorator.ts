import 'reflect-metadata';
import {Type} from "../../type.interface";
import {ifPresent, Maybe} from "../../maybe";

const PropertyDecoratorMetadata = Symbol('PropertyDecoratorMetadata');

type ReadMap<T, R = T> = (i: T) => R;

export interface PropertyDecoratorDefinition {
    /**
     * The path to property in a PropertyMap
     * e.g. 'my-property.from.any.source'
     * @see PropertyMap
     */
    path: string;

    /**
     * The actual key of a class property
     * e.g. For this class
     *
     * <code>
     * class Test {
     *     @Property('some.property.path')
     *     myProp: string = ''
     * }
     * </code>
     *
     * the property is 'myProp'
     *
     */
    property: string;

    reader: ReadMap<any>
}

const identity = <T>(x:T) => x;

export function Property(path: string, reader: ReadMap<any> = identity) {
    return ({constructor}: any, property: string) => {
        const propertiesInClass = getPropertyDecoratorDefinitions(constructor);
        Reflect.defineMetadata(PropertyDecoratorMetadata, [
            ...propertiesInClass,
            {path, property, reader}
        ], constructor)
    }
}

const onlyValue = <T>(reader: ReadMap<T>) => (v: Maybe<T>) => ifPresent(v, reader, () => v);

/**
 * Converts value to Boolean if present
 * @param path
 * @constructor
 */
export const BooleanProperty = (path: string) => Property(path, onlyValue(Boolean));

/**
 * Converts value to Number if present
 * @param path
 * @constructor
 */
export const NumberProperty = (path: string) => Property(path, onlyValue(Number));

/**
 * Converts value to String if present
 * @param path
 * @constructor
 */
export const StringProperty = (path: string) => Property(path, onlyValue(String));

export interface ListPropertyOptions {
    delimiter: string,
    mapper: ReadMap<string, any>
}



/**
 * Assuming a string string data (all inputs are converted to string).
 *
 * @param path
 * @param delimiter - default: ,
 * @param mapper - trims each string value
 * @constructor
 */
export const ListProperty = (path: string, {
    delimiter = ',',
    mapper = (s: string) => s.trim()
}: Partial<ListPropertyOptions> = {}) => Property(path, onlyValue(v => {
    return Array.isArray(v) ? v.map(mapper) : String(v).split(delimiter).map(mapper)
}));

export function getPropertyDecoratorDefinitions(type: Type<any>): PropertyDecoratorDefinition[] {
    return Reflect.getMetadata(PropertyDecoratorMetadata, type) || [];
}

