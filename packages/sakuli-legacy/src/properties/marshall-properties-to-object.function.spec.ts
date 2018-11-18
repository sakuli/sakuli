import { JavaProperty } from "./java-properties.decorator";
import { MaybeMocked } from "ts-jest/dist/util/testing";
import PropertiesReader from 'properties-reader'
import { marshallPropertiesToObject } from "./marshall-properties-to-object.function";

jest.mock('properties-reader');

describe('MarshallPropertiesToobject', () => {

    class TestClass {
        @JavaProperty('test.property')
        testProperty: string = ''
    }

    let getterMock: jest.Mock;
    let readerMock: jest.Mocked<typeof PropertiesReader>;

    beforeEach(() => {
        getterMock = jest.fn();
        readerMock = jest.fn().mockImplementation(() => ({
            get: getterMock
        }))
    })

    it('should preserve type of marshalled object', () => {
        const testobject: TestClass = marshallPropertiesToObject(TestClass, readerMock(''));
        expect(testobject).toBeInstanceOf(TestClass);
    })

    it('should create a object from TestClass definition', () => {
        getterMock.mockReturnValue('new value');
        const testobject: TestClass = marshallPropertiesToObject(TestClass, readerMock(''));
        expect(getterMock).toHaveBeenCalledTimes(1);
        expect(getterMock).toHaveBeenCalledWith('test.property');
        expect(testobject.testProperty).toEqual('new value');
    });
});
