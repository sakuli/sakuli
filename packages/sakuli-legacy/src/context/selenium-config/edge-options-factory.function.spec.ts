import {EdgeProperties} from "./edge-properties.class";
import {edgeOptionsFactory} from "./edge-options-factory.function";
import objectContaining = jasmine.objectContaining;

jest.mock('selenium-webdriver/edge', () => ({
    Options: jest.fn().mockImplementation(() => ({
        setProxy: jest.fn(),
    }))
}));

describe('edgeOptionsFactory', () => {

    let props: EdgeProperties;
    beforeEach(() => {
        props = new EdgeProperties();
    });

    it('should set simple string values', () => {
        // GIVEN
        props.pageLoadStrategy = 'normal';
        props.proxy = {
            proxyType: 'proxy'
        };

        // WHEN
        const opts = edgeOptionsFactory(props);

        // THEN
        expect(opts.setProxy).toHaveBeenCalledWith(objectContaining({
            proxyType: 'proxy'
        }));
    });


});