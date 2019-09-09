import { StaticPropertySource } from "./static-property-source.class";

describe('StaticPropertySource', () => {

    it('should get values from a record', async () => {
        const source = new StaticPropertySource({
            'test.id': 'sakuli'
        });
        const map = await source.createPropertyMap();
        expect(map.get('test.id')).toBe('sakuli');
    })

    it('should get values from a map', async () => {
        const staticMap = new Map<string, string>();
        staticMap.set('test.id', 'sakuli');
        const source = new StaticPropertySource(staticMap);
        const map = await source.createPropertyMap();
        expect(map.get('test.id')).toBe('sakuli');
    })

});
