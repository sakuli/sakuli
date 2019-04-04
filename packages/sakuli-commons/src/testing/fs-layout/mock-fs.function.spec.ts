import {flattenLayout} from "./mock-fs.function";
import {stripIndent} from "common-tags";

describe('mock-fs', () => {

    describe('flatLayout', () => {

        it('should reduce FsLayout to Record', () => {
            const flatted = flattenLayout({
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

            expect(flatted).toEqual(expect.objectContaining({
                "/path/to/testsuites/sakuli.properties": expect.stringContaining('sakuli.environment.similarity'),
                "/path/to/testsuites/suite/case2/sakuli_demo.js": "// Test"
            }))
        });

    })

});