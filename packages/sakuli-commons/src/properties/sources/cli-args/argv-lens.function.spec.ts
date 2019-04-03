import {argvLens} from "./argv-lens.function";

describe("argvLens", () => {

    let data: any;

    beforeEach(() => {
        data = {
            foo: [
                {bar: 'fooBar'},
                'foo',
                {deepBar: {bar: 'fooDeepBar'}}
            ]
        };
    });

    it.each([
        [['foo'], 'foo'],
        [['foo', 'bar'], 'fooBar'],
        [['foo', 'deepBar', 'bar'], 'fooDeepBar'],
    ])("should read from path %s the value %s", (path: string[], expectedValue: string) => {
        const lens = argvLens(path);
        expect(lens(data)).toEqual(expectedValue);

    })

});