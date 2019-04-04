//jest.mock('fs');

import {Sakuli, SakuliClass} from "./sakuli.class";
import {SakuliExecutionContextProvider} from "./runner/test-execution-context";
import {SakuliPresetRegistry} from "./sakuli-preset-registry.class";
import {Project} from "./loader";
import {stripIndent} from "common-tags";
import mockFs from 'mock-fs';
import {mockPartial} from "sneer";


describe('Sakuli', () => {

    it('should always return same instance of SakuliClass', () => {
        expect(
            Sakuli([])
        ).toBe(
            Sakuli([])
        )
    });

    describe('SakuliClass', () => {

        it('Should have at least the sakuli context provider', () => {
            const sakuli = new SakuliClass([]);
            expect(sakuli.contextProviders.length).toBe(1);
            expect(sakuli.contextProviders[0]).toBeInstanceOf(SakuliExecutionContextProvider);
        });

        xit('Should have at least one forwarder', () => {
            const sakuli = new SakuliClass([]);
            expect(sakuli.forwarder.length).toBe(1);
        });

        it('should have no loaders', () => {
            const sakuli = new SakuliClass([]);
            expect(sakuli.loader.length).toBe(0);
        });

        it.skip('should throw because no project could be created', async done => {
            const sakuli = new SakuliClass([]);
            try {
                await sakuli.run('dummy/path');
                done.fail();
            } catch (e) {
                done()
            }
        });

        it.skip('should execute correctly', async done => {
            mockFs({
                'project-dir': {
                    'test1.js': stripIndent`
                    Sakuli().testExecutionContext.startTestSuite({id: 'My Suite'});                    
                    Sakuli().testExecutionContext.endTestSuite();
                    done();
                `
                }
            });

            const sakuli = new SakuliClass([
                (<any>jest.fn)((reg: SakuliPresetRegistry) => {
                    reg.registerProjectLoader({
                        load: (<any>jest.fn)((root: string): Project => (mockPartial<Project>({
                            rootDir: root,
                            testFiles: [
                                {path: 'test1.js'}
                            ]
                        })))
                    })
                })
            ]);

            await sakuli.run('project-dir');
            done();
        });


        afterEach(() => mockFs.restore())
    });
});
