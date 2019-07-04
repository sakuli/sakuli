import {PropertySource, PropertyMap} from "../../model";

export class EnvironmentSource implements PropertySource {

    constructor() {}

    async createPropertyMap(): Promise<PropertyMap> {
        const get = (key: string) => {
            return process.env[key];
        };

        const has = (key: string) => {
            return get(key) != null;
        };
        return {get, has};
    }
}