import { LegacyProjectProperties } from "./legacy-project-properties.class";

describe('LegacyProjectProperties', () => {
    let props: LegacyProjectProperties;
    beforeEach(() => {
        props = new LegacyProjectProperties();
    });

    it('should return browser value if set', () => {
        props.browser = 'chrome';
        expect(props.getBrowser()).toEqual('chrome');

    })

    it('should return browser value if set', () => {
        props.testsuiteBrowser = 'chrome';
        expect(props.getBrowser()).toEqual('chrome');
    })

    it('should return browser value if set regardless of testsuiteBrowser value', () => {
        props.browser = 'chrome';
        props.testsuiteBrowser = 'ie';
        expect(props.getBrowser()).toEqual('chrome');
    })

    it('should return firefox as default', () => {
        expect(props.getBrowser()).toEqual('firefox');
    })
});
