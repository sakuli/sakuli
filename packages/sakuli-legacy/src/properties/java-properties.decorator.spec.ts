import { JavaProperty, getJavaPropertyDefinitons } from "./java-properties.decorator";

describe('JavaProperty decorator', () => {

    class TestClass {
        @JavaProperty('java.property.path')
        javaProperty: string = '';

        @JavaProperty('java.property.2')
        javaProperty2: string = '';

        simpleProperty: string = ''
    }

    it('should get defined javaproperties', () => {
        const jpDef = getJavaPropertyDefinitons(TestClass)
        expect(jpDef.length).toBe(2);
        expect(jpDef).toContainEqual({path: 'java.property.path', property: 'javaProperty'})
        expect(jpDef).toContainEqual({path: 'java.property.2', property: 'javaProperty2'})
    })
})