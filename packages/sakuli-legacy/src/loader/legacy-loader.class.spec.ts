import {LegacyLoader} from "./legacy-loader.class";
import {stripIndent} from 'common-tags';
import {Project} from "@sakuli/core";
import {mockFs} from "@sakuli/commons";

describe('LegacyLoader', () => {

    describe('with a valid project structure', () => {
        let loader: LegacyLoader;
        let project: Project;
        beforeEach(async function mockValidProjectLayout(done) {
            mockFs({
                'path/to/testsuites': {
                    'sakuli.properties': `
                        sakuli.environment.similarity.default=0.99
                    `,
                    'suite': {
                        'testsuite.properties': `testsuite.name=test`,
                        'testsuite.suite': stripIndent`
                            case1/sakuli_demo.js http://sahi.example.com/_s_/dyn/Driver_initialized
                            case2/sakuli_demo.js http://sahi.example.com/_s_/dyn/Driver_initialized
                        `,
                        case1: {
                            'sakuli_demo.js': '// Test'
                        },
                        case2: {
                            'sakuli_demo.js': '// Test'
                        }
                    }
                }
            });
            loader = new LegacyLoader();
            project = await loader.load(new Project('path/to/testsuites/suite'));
            done();
        });

        it('should read sahi file', () => {
            expect(project.testFiles.length).toBe(2);
        })

    });

    it('should throw with missing testsuite.properties', async (done) => {
        let loader: LegacyLoader;

        mockFs({
            'path/to/testsuites': {
                'sakuli.properties': `
                        sakuli.environment.similarity.default=0.99
                    `,
                'suite': {
                    'testsuite.suite': stripIndent`
                            case1/sakuli_demo.js http://sahi.example.com/_s_/dyn/Driver_initialized
                            case2/sakuli_demo.js http://sahi.example.com/_s_/dyn/Driver_initialized
                        `,
                    case1: {
                        'sakuli_demo.js': '// Test'
                    },
                    case2: {
                        'sakuli_demo.js': '// Test'
                    }
                }
            }
        });
        try {
            loader = new LegacyLoader();
            await loader.load(new Project('path/to/testsuites/suite'));
            done.fail();
        } catch (e) {
            expect(e.message).toContain('testsuite.properties');
            done()
        }
    });

    afterEach(() => {
        mockFs.restore();
    })
});
