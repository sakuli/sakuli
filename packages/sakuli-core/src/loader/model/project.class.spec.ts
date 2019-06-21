import {Project} from "./project.class";
import {PropertyMap} from "@sakuli/commons";

describe('Project', () => {

    let staticSakuliProperties = new Map([
        ['testsuite.id', 'sakuli'],
        ['cascaded', 'casc-1'],
    ]);
    let staticOtherProperties = new Map([
        ['forwarder.target', '${testsuite.id}'],
        ['cascaded', 'casc-2']
    ]);
    let projectUnderTest: Project;

    beforeEach(async () => {
        projectUnderTest = new Project('');
        await projectUnderTest.installPropertySource({
            createPropertyMap(): Promise<PropertyMap> {
                return Promise.resolve(staticSakuliProperties);
            }
        });
        await projectUnderTest.installPropertySource({
            createPropertyMap(): Promise<PropertyMap> {
                return Promise.resolve(staticOtherProperties);
            }
        })
    });
    it('should utilize tempalted values', () => {
        expect(projectUnderTest.get('forwarder.target')).toBe('sakuli')
    });

    it('should read from source1', () => {
        expect(projectUnderTest.get('testsuite.id')).toBe('sakuli')
    });

    it('should cascade values from installed sources', () => {
        expect(projectUnderTest.get('cascaded')).toBe('casc-1')
    });

});