import 'reflect-metadata';
import {Type} from "../../type.interface";

const PropertyDecoratorMetadata = Symbol('PropertyDecoratorMetadata');

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
}

export function Property(path: string) {
    return ({constructor}: any, property: string) => {
        const propertiesInClass = getPropertyDecoratorDefinitions(constructor);
        Reflect.defineMetadata(PropertyDecoratorMetadata, [
            ...propertiesInClass,
            {path, property}
        ], constructor)
    }
}

export function getPropertyDecoratorDefinitions(type: Type<any>): PropertyDecoratorDefinition[] {
    return Reflect.getMetadata(PropertyDecoratorMetadata, type) || [];
}