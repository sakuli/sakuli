import { createPropertyReader } from "./create-properties-reader.function";
import {writeFileSync, unlink, unlinkSync} from 'fs';

describe('JavaPropertiesReader', () => {

    const testFiles: ({name: string, content: string})[] = [
        {name: 'test1.properties', content: `
        property.foo=fooval
        property.bar=barval
        `},
        {name: 'test2.properties', content: `
        property.bar=overridden
        property.baz=bazval
        `}
    ];

    beforeAll(() => {
        testFiles.forEach(({name, content}) => writeFileSync(name, content))
    })

    it('should create a reader', () => {
        const [testfile] = testFiles;
        const reader = createPropertyReader(testfile.name);
        const all = reader.getAllProperties();
        expect(Object.keys(all).length).toBe(2);
        expect(all['property.foo']).toBe('fooval');
        expect(all['property.bar']).toBe('barval');
    });

    it('should create a reader with multiple files and override mechanism', () => {
        const reader = createPropertyReader(testFiles.map(f => f.name))
        const all = reader.getAllProperties();
        expect(Object.keys(all).length).toBe(3);
        expect(all['property.foo']).toBe('fooval');
        expect(all['property.bar']).toBe('overridden');
        expect(all['property.baz']).toBe('bazval');
    })

    afterAll(() => {
        testFiles.forEach(({name}) => unlinkSync(name))
    })
});
