import {Capabilities} from 'selenium-webdriver';
import {throwIfAbsent} from "@sakuli/commons";
import {Project} from "@sakuli/core";
import {LegacyProjectProperties} from "../loader/legacy-project-properties.class";

export interface CapabilitiesBuilderInterface {
    build() : Capabilities;
}

abstract class CapabilitiesBuilder {
    project : Project;
    properties : LegacyProjectProperties;

    abstract produce() : Capabilities;
    abstract applyExtensions(capabilities : Capabilities) : void;

    constructor(project : Project) {
        this.project = project;
        this.properties = this.project.objectFactory(LegacyProjectProperties);
    }

    build() {
        const caps = this.produce();

        this.applyExtensions(caps);

        return caps;
    }
}

export class GenericCapabilitiesBuilder extends CapabilitiesBuilder implements CapabilitiesBuilderInterface  {
    capabilityMap: { [key: string]: () => Capabilities } = {
        'chrome': () => Capabilities.chrome(),
        'firefox': () => Capabilities.firefox(),
        'edge': () => Capabilities.edge(),
        'safari': () => Capabilities.safari(),
        'ie': () => Capabilities.ie(),
        'phantomjs': () => Capabilities.phantomjs(),
        'htmlunit': () => Capabilities.htmlunit(),
        'htmlunitwithjs': () => Capabilities.htmlunitwithjs(),
    };

    constructor(project : Project) {
        super(project);
    }

    produce() : Capabilities {
        const browser: keyof typeof Capabilities = this.properties.testsuiteBrowser;
        const capsProducer = throwIfAbsent(this.capabilityMap[browser], Error(`${browser} is not a valid browser`));
        return capsProducer();
    }

    applyExtensions(capabilities : Capabilities) : void {
    }
}