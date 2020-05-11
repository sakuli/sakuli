import { PropertyMap, PropertySource } from "../../model";
import { isPresent } from "../../../maybe";

export class EnvironmentSource implements PropertySource {
  constructor() {}

  async createPropertyMap(): Promise<PropertyMap> {
    const get = (key: string) => {
      return process.env[key];
    };

    const has = (key: string) => {
      return isPresent(get(key));
    };
    return { get, has };
  }
}
