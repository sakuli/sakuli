import {ChromeCapabilitiesBuilder} from "./chrome-capabilities-builder.class";
import {mockPartial} from "sneer";
import {LegacyProjectProperties} from "../loader/legacy-project-properties.class";
import {Project} from "@sakuli/core";
import {createPropertyMapMock} from "@sakuli/commons/dist/properties/__mocks__";

describe(ChromeCapabilitiesBuilder.name, () => {
    const legacyProps = new LegacyProjectProperties();
    legacyProps.testsuiteBrowser = 'chrome';
    legacyProps.testsuiteBrowserExtensions = 'foo, bar';
    const minimumProject = mockPartial<Project>({
        rootDir: '',
        testFiles: [],
        objectFactory: jest.fn().mockReturnValue(legacyProps),
        ...(createPropertyMapMock({

        }))
    });
    const ccb = new ChromeCapabilitiesBuilder(minimumProject);

    describe('Chrome capability builder', () => {
        it('should build Chrome capabilities with extensions', async () => {
            const capabilities = await ccb.build();
            return expect(
                capabilities.get('chromeOptions')['extensions_']
            ).toEqual(expect.arrayContaining(['foo', 'bar']));
        });
    });
});