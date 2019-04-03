import {PropertyMap} from "./property-map.interface";

/**
 *
 */
export interface PropertySource {
    createPropertyMap(): Promise<PropertyMap>
}
