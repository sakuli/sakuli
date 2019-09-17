import {PropertyMap} from "./model";
import {TemplatedPropertyMap} from "./maps/templated-property-map.class";

describe('TemplatedPropertyMap', () => {

    const _values: Record<string, string> = {
        "basedir": 'some/path',
        "workingdir": "${basedir}/work",
        "logdir": "${workingdir}/logs",
        "errorlogdir": "${logdir}/errors",

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

    it('should render nested templated values', () => {
        expect(mapUnderTest.get('logdir')).toBe('some/path/work/logs')
    });

    it('should render deeply nested templated values', () => {
        expect(mapUnderTest.get('errorlogdir')).toBe('some/path/work/logs/errors')
    });
});
