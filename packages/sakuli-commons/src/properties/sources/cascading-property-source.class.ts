import {PropertyMap, PropertySource} from "../model";
import {ifPresent, isPresent} from "../../maybe";

export class CascadingPropertyMap implements PropertyMap {
    private propertyMaps: PropertyMap[] = [];

    async installSource(source: PropertySource): Promise<void> {
        this.propertyMaps.push(await source.createPropertyMap());
    }

    get(key: string): string | null {

        return ifPresent([...this.propertyMaps].reverse().find(m => m.has(key)),
            map => map.get(key),
            () => null
        )
    }

    has(key: string): boolean {
        return isPresent(this.get(key));
    }
}
