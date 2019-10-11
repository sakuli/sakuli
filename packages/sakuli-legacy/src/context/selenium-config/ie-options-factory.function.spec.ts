import {ieOptionsFactory} from "./ie-options-factory.function";
import {IeProperties} from "./ie-properties.class";
import objectContaining = jasmine.objectContaining;

jest.mock('selenium-webdriver/ie', () => ({
    Options: jest.fn().mockImplementation(() => ({
        ignoreZoomSetting: jest.fn(),
        initialBrowserUrl: jest.fn(),
        enablePersistentHover: jest.fn(),
        enableElementCacheCleanup: jest.fn(),
        requireWindowFocus: jest.fn(),
        browserAttachTimeout: jest.fn(),
        forceCreateProcessApi: jest.fn(),
        addArguments: jest.fn(),
        usePerProcessProxy: jest.fn(),
        ensureCleanSession: jest.fn(),
        setLogFile: jest.fn(),
        setLogLevel: jest.fn(),
        setHost: jest.fn(),
        setExtractPath: jest.fn(),
        silent: jest.fn(),
        setProxy: jest.fn(),
    }))
}));

describe('ieOptionsFactory', () => {

    let props: IeProperties;
    beforeEach(() => {
        props = new IeProperties();
    });

    it('should set simple string values', () => {
        // GIVEN
        props.ignoreZoomSetting = false;
        props.initialBrowserUrl = 'sakuli.io';
        props.enablePersistentHover = false;
        props.enableElementCacheCleanup = false;
        props.requireWindowFocus = true;
        props.arguments = ['arg'];
        props.browserAttachTimeout = 300;
        props.forceCreateProcessApi = false;
        props.usePerProcessProxy = false;
        props.ensureCleanSession = true;
        props.logFile = 'file';
        props.host = 'host';
        props.extractPath = 'path';
        props.silent = true;
        props.proxy = {
            proxyType: 'proxy'
        };

        // WHEN
        const opts = ieOptionsFactory(props);

        // THEN
        expect(opts.ignoreZoomSetting).toHaveBeenCalledWith(false);
        expect(opts.initialBrowserUrl).toHaveBeenCalledWith('sakuli.io');
        expect(opts.enablePersistentHover).toHaveBeenCalledWith(false);
        expect(opts.enableElementCacheCleanup).toHaveBeenCalledWith(false);
        expect(opts.requireWindowFocus).toHaveBeenCalledWith(true);
        expect(opts.browserAttachTimeout).toHaveBeenCalledWith(300);
        expect(opts.forceCreateProcessApi).toHaveBeenCalledWith(false);
        expect(opts.addArguments).toHaveBeenCalledWith('arg');
        expect(opts.usePerProcessProxy).toHaveBeenCalledWith(false);
        expect(opts.ensureCleanSession).toHaveBeenCalledWith(true);
        expect(opts.setLogFile).toHaveBeenCalledWith('file');
        expect(opts.setHost).toHaveBeenCalledWith('host');
        expect(opts.setExtractPath).toHaveBeenCalledWith('path');
        expect(opts.silent).toHaveBeenCalledWith(true);
        expect(opts.setProxy).toHaveBeenCalledWith(objectContaining({
            proxyType: 'proxy'
        }));
    });


});