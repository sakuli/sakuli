import mockFs from 'mock-fs';
import { LegacyLoader } from "./legacy-loader.class";
import { readdirSync } from "fs-extra";
import { stripIndent } from 'common-tags';
import { LegacyProject } from './legacy-project.class';

describe('LegacyLoader', () => {

    describe('with a valid project structure', () => {
        let loader: LegacyLoader;
        let project: LegacyProject;
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
            })
            loader = new LegacyLoader();
            project = await loader.load('path/to/testsuites/suite');
            done();
        })

        it('should read property files in correct priority', () => {
            expect(project.properties.testsuiteName).toBe('test')
            expect(project.properties.sakuliEnvironmentSimilarityDefault).toEqual(.99);
        });

        it('should read sahi file', () => {
            expect(project.testFiles.length).toBe(2);
        })

    })

    it('should throw with missing testsuite.properties', async (done) => {
        let loader: LegacyLoader;
        let project: LegacyProject;

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
        })
        try {
            loader = new LegacyLoader();
            project = await loader.load('path/to/testsuites/suite');
            done.fail();
        } catch (e) {
            expect(e.message).toContain('testsuite.properties');
            done()
        }
    })

    it('should throw with missing testsuite.properties', async (done) => {
        let loader: LegacyLoader;
        let project: LegacyProject;
        mockFs({
            'path/to/testsuites': {
                'sakuli.properties': `
                        sakuli.environment.similarity.default=0.99
                    `,
                'suite': {
                    'testsuite.properties': ''
                }
            }
        })
        try {
            loader = new LegacyLoader();
            project = await loader.load('path/to/testsuites/suite');
            done.fail();
        } catch (e) {
            expect(e.message).toContain('testsuite.suite')
            done();
        }
    })




    afterEach(() => {
        mockFs.restore();
    })
});
