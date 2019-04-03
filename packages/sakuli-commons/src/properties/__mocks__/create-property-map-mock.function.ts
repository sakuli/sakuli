import {PropertyMap} from "../model";

export function createPropertyMapMock(record: Record<string, string>): PropertyMap {
    const get = jest.fn((key: string) => record[key]);
    const has = jest.fn((key: string) => record[key] != null);
    return ({get, has})
}
