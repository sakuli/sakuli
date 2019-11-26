import {FirefoxProperties} from "./firefox-properties.class";
import {firefoxOptionsFactory} from "./firefox-options-factory.function";
import objectContaining = jasmine.objectContaining;

jest.mock('selenium-webdriver/firefox', () => ({
    Options: jest.fn().mockImplementation(() => ({
        setProxy: jest.fn(),
        setBinary: jest.fn(),
        useGeckoDriver: jest.fn(),
        setProfile: jest.fn()
    }))
}));

describe('firefoxOptionsFactory', () => {

    let props: FirefoxProperties;
    beforeEach(() => {
        props = new FirefoxProperties();
    });

    it('should set simple string values', () => {
        // GIVEN
        props.binary = 'path/to/binary';
        props.profile = 'path/to/profile';
        props.useGeckoDriver = false;
        props.proxy = {
            proxyType: 'proxy'
        };

        // WHEN
        const opts = firefoxOptionsFactory(props);

        // THEN
        expect(opts.setBinary).toHaveBeenCalledWith('path/to/binary');
        expect(opts.setProfile).toHaveBeenCalledWith('path/to/profile');
        expect(opts.useGeckoDriver).toHaveBeenCalledWith(false);
        expect(opts.setProxy).toHaveBeenCalledWith(objectContaining({
            proxyType: 'proxy'
        }));
    });


});