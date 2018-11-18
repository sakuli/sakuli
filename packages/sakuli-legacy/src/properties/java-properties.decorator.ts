import 'reflect-metadata';
import { Type } from '@sakuli/commons';

const JavaPropertyMetadata = Symbol('JavaPropertyMetadata');

export interface JavaPropertyDefiniton {
    path: string;
    property: string;
}

export function JavaProperty(path: string) {
    return ({constructor}: any, property: string) => {
        const propertiesInClass = getJavaPropertyDefinitons(constructor);
        Reflect.defineMetadata(JavaPropertyMetadata, [
            ...propertiesInClass,
            {path, property}
        ], constructor)
    }
}

export function getJavaPropertyDefinitons(type: Type<any>): JavaPropertyDefiniton[] {
    return Reflect.getMetadata(JavaPropertyMetadata, type) || [];
}