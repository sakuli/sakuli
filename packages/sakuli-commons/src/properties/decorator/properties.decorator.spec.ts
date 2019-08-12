import {getPropertyDecoratorDefinitions} from "./properties.decorator";
import {DecoratedBooleanTestClass, DecoratedTestClass} from "../__mocks__";


describe('Property decorator', () => {

    it('should get defined properties', () => {
        const jpDef = getPropertyDecoratorDefinitions(DecoratedTestClass);
        expect(jpDef.length).toBe(7);
        expect(jpDef).toContainEqual({path: 'my.property.path', property: 'property', reader: expect.any(Function)});
        expect(jpDef).toContainEqual({path: 'property.2', property: 'property2', reader: expect.any(Function)});
        expect(jpDef).toContainEqual({path: 'property.alt', property: 'property2', reader: expect.any(Function)});
    });

});

describe('BooleanPropertyReader', () => {
    const jpDef = getPropertyDecoratorDefinitions(DecoratedBooleanTestClass);
    const reader = jpDef[0].reader;

    it.each(<[string | number | undefined | null, boolean][]>[
        ['false', false],
        ['', false],
        [0, false],
        [undefined, false],
        [null, false],
        ["true", true],
        ["set", true],
        [1, true],
    ])('should map %p to %p', (input, expected) => {
        expect(jpDef).toContainEqual({path: 'boolean.prop', property: 'booleanProp', reader: expect.any(Function)});
        expect(reader(input)).toBe(expected);
    });
});