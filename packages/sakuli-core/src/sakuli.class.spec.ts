jest.mock('fs');

import { Sakuli } from "./sakuli.class";
import { SakuliExecutionContextProvider } from "./runner/test-execution-context/sakuli-execution-context-provider.class";
import { SakuliPresetRegistry } from "./sakuli-preset-registry.class";
import { Project } from "./loader";
import { stripIndent } from "common-tags";
import { MockFsLayout } from "@sakuli/commons";
import { readFileSync } from "fs";

describe('Sakuli', () => {
    it('Should have at least the sakuli context provider', () => {
        const sakuli = new Sakuli([]);
        expect(sakuli.contextProviders.length).toBe(1);
        expect(sakuli.contextProviders[0]).toBeInstanceOf(SakuliExecutionContextProvider);
    });

    it('Should have at least one forwarder', () => {
        const sakuli = new Sakuli([]);
        expect(sakuli.forwarder.length).toBe(1);
    })

    it('should have no loaders', () => {
        const sakuli = new Sakuli([]);
        expect(sakuli.loader.length).toBe(0);
    })

    it('should throw because no project could be created', async done => {
        const sakuli = new Sakuli([]);
        try {
            await sakuli.run('dummy/path');
            done.fail();
        } catch (e) {
            done()
        }
    })


    it('should execute correctly', async done => {
        const fsLayout = new MockFsLayout({
            'project-dir': {
                'test1.js': stripIndent`
                    sakuliContext.startTestSuite({id: 'My Suite'});                    
                    sakuliContext.endTestSuite();
                `
            }
        });
        (<jest.Mock<typeof readFileSync>>readFileSync).mockImplementation((path: string) => {
            return fsLayout.getFile(path);
        })
        const sakuli = new Sakuli([
            jest.fn((reg: SakuliPresetRegistry) => {
                reg.registerProjectLoader({
                    load: jest.fn((root: string): Project => ({
                        rootDir: root,
                        testFiles: [
                            { path: 'test1.js' }
                        ]
                    }))
                })
            })
        ])

        await sakuli.run('project-dir');
        done();
    })
    
});
