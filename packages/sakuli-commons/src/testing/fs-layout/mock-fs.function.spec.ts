import {flattenLayout, mockFs} from "./mock-fs.function";
import {stripIndent} from "common-tags";
import {vol} from "memfs";
jest.mock('fs', () => vol);
import {readdirSync, readFileSync} from "fs";



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
                "path/to/testsuites/sakuli.properties": expect.stringContaining('sakuli.environment.similarity'),
                "path/to/testsuites/suite/case2/sakuli_demo.js": "// Test"
            }))
        });

    })

    describe('mocked function', () => {
        it('should mock a file', () => {
            mockFs({
                "path": {
                    "to": {
                        "file.txt": "Hello World"
                    }
                }
            });

            const fileContent = readFileSync('path/to/file.txt').toString();
            expect(fileContent).toEqual('Hello World')

        });

        it('should readDir', () => {
            mockFs({
                "path": {
                    "to": {
                        "file.txt": "Hello World"
                    }
                }
            });
            const dirCnt = readdirSync('path');
            expect(dirCnt).toEqual(expect.arrayContaining(['to']))
        });
    })

});