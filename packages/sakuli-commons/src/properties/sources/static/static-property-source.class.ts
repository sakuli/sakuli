import { PropertyMap, PropertySource } from "../../model";

export class StaticPropertySource implements PropertySource {
  constructor(
    readonly staticValues: Record<string, string> | Map<string, string>
  ) {}

  async createPropertyMap(): Promise<PropertyMap> {
    if (this.staticValues instanceof Map) {
      return this.staticValues;
    } else {
      const values = this.staticValues;
      return {
        get(key: string) {
          return values[key];
        },
        has(key: string) {
          return !!values[key];
        },
      };
    }
  }
}
