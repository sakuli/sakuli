import {createLens} from "./create-lens.function";

describe('create-lens', () => {
    const o = {
        foo: {
            bar: {
                a: 1,
                b: 2
            }
        }
    };

    let lens: (p: string[]) => any;
    beforeEach(() => {
        lens = createLens(o);
    });

    it(`should resolve ['foo'] to object bar`, () => {
        expect(lens(['foo'])).toEqual({
            bar: {
                a: 1,
                b: 2
            }
        })
    });

    it(`should resolve ['foo', 'bar'] to be {a,b}`, () => {
        expect(lens(['foo', 'bar'])).toEqual({
            a: 1,
            b: 2
        });
    });

    it(`should resolve ['foo', 'bar', 'a']`, () => {
        expect(lens(['foo', 'bar', 'a'])).toEqual(1);
    });

    it(`should resolve ['foo', 'baz', 'a'] to undefined`, () => {
        expect(lens(['foo', 'baz', 'a'])).toBeNull();
    });

});