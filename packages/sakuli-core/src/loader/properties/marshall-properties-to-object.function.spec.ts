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

    let readerReadMock: jest.Mock;
    let readerMock: jest.Mocked<typeof PropertiesReader>;

    beforeEach(() => {
        readerReadMock = jest.fn();
        readerMock = jest.fn().mockImplementation(() => ({
            read: readerReadMock
        }))
    })

    it('it should create a object from TestClass definition', () => {
        readerReadMock.mockReturnValue('new value');
        const testobject = marshallPropertiesToObject(TestClass, readerMock(''));
        expect(readerReadMock).toHaveBeenCalledTimes(1);
        expect(readerReadMock).toHaveBeenCalledWith('test.property');
        expect(testobject.testProperty).toEqual('new value');
    });
});
