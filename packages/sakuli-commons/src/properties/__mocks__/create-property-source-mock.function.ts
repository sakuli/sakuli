import { PropertySource } from "../model";
import { createPropertyMapMock } from "./create-property-map-mock.function";

export function createPropertySourceMock(
  record: Record<string, string>
): PropertySource {
  return {
    createPropertyMap: jest.fn(() =>
      Promise.resolve(createPropertyMapMock(record))
    ),
  };
}
