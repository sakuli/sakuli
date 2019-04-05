//jest.mock('fs');

import {Sakuli, SakuliClass} from "./sakuli.class";
import {SakuliExecutionContextProvider} from "./runner/test-execution-context";
import {SakuliPresetRegistry} from "./sakuli-preset-registry.class";
import {Project} from "./loader";
import {stripIndent} from "common-tags";
import mockFs from 'mock-fs';
import {mockPartial} from "sneer";
import {CliArgsSource} from "@sakuli/commons";

const installPropertySourceMock = jest.fn();
jest.mock('./loader/model/project.class', () => ({
    Project: jest.fn(() => ({
        installPropertySource: installPropertySourceMock,
        testFiles: []
    })),
}));

afterEach(() => installPropertySourceMock.mockReset());

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
            expect(sakuli.lifecycleHooks.length).toBe(1);
            expect(sakuli.lifecycleHooks[0]).toBeInstanceOf(SakuliExecutionContextProvider);
        });

        it('should have no loaders', () => {
            const sakuli = new SakuliClass([]);
            expect(sakuli.loader.length).toBe(0);
        });

        it('should create a Project', async () => {
            const sakuli = new SakuliClass([]);
            await sakuli.run('dummy/path');
            expect(Project).toHaveBeenCalledWith('dummy/path');
            expect(installPropertySourceMock).toHaveBeenCalledWith(expect.any(CliArgsSource));
        });

        it('should execute correctly', async done => {
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
