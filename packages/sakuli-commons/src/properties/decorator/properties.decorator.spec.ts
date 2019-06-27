import {getPropertyDecoratorDefinitions} from "./properties.decorator";
import {DecoratedTestClass} from "../__mocks__";


describe('Property decorator', () => {


    it('should get defined properties', () => {
        const jpDef = getPropertyDecoratorDefinitions(DecoratedTestClass);
        expect(jpDef.length).toBe(7);
        expect(jpDef).toContainEqual({path: 'my.property.path', property: 'property', reader: expect.any(Function)});
        expect(jpDef).toContainEqual({path: 'property.2', property: 'property2', reader: expect.any(Function)});
        expect(jpDef).toContainEqual({path: 'property.alt', property: 'property2', reader: expect.any(Function)})
    })
});