import {PropertyMap} from "../model";
import {TemplatedPropertyMap} from "./templated-property-source.class";

describe('TemplatedPropertyMap', () => {

    const _values: Record<string, string> = {
        "basedir": 'some/path',
        "workingdir": "${basedir}/work"
    };
    const staticPropMap: PropertyMap = {
        get: (key: string) => {
            return _values[key];
        },
        has(key: string) {
            return !!_values[key];
        }
    };

    let mapUnderTest: PropertyMap;
    beforeEach(() => {
        mapUnderTest = new TemplatedPropertyMap(staticPropMap);
    });

    it('should read values from "baseMap"', () => {
        expect(mapUnderTest.get('basedir')).toBe('some/path');
    });

    it('should render templated values', () => {
        expect(mapUnderTest.get('workingdir')).toBe('some/path/work');

    });
});