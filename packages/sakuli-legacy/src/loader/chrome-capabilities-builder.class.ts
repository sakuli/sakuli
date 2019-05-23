import {Capabilities} from 'selenium-webdriver';
import {Options as ChromeOptions} from 'selenium-webdriver/chrome';
import {CapabilitiesBuilderInterface, CapabilitiesBuilder} from "../loader/capabilities-builder.class";

const OPTIONS_CAPABILITY_KEY = 'chromeOptions';

export class ChromeCapabilitiesBuilder extends CapabilitiesBuilder implements CapabilitiesBuilderInterface {
    produce() : Capabilities {
        return Capabilities.chrome();
    }

    applyExtensions(capabilities : Capabilities) : void {
        const options = capabilities.get(OPTIONS_CAPABILITY_KEY) || new ChromeOptions();
        const extensions : string[] =
            this.properties.testsuiteBrowserExtensions.split(",").map(ext => ext.trim());

        extensions.forEach(each => options.addExtensions(each));

        capabilities.set(OPTIONS_CAPABILITY_KEY, options);
    }
}