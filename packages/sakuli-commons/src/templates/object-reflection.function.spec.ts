import {objectReflection} from "./object-reflection.function";

describe('object-reflection', () => {

    const testObject = {
        foo: {
            bar: {
                a: 1,
                b: 2
            }
        }
    };

    it('should wrap a reflection upon a lens with default separator', () => {
        const reflection = objectReflection(testObject);
        expect(reflection('foo.bar')).toEqual(expect.objectContaining({
            a: 1,
            b: 2
        }))
    });

    it('should wrap a reflection upon a lens with separator="->"', () => {
        const reflection = objectReflection(testObject, '->');
        expect(reflection('foo->bar->b')).toEqual(2);
    });

});