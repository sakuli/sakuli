/*
const mockFileMao

jest.mock('fs-extra', () => ({
    readJsonSync(path:string) {

    }
}))
*/

import mockFs from 'mock-fs';
import {loadBootstrapOptions} from "./load-bootstrap-options.function";

describe('loadBootstrapOptions', () => {

    it('should load from package json file', async done => {
        mockFs({
            root: {
                "package.json": JSON.stringify({
                    "sakuli": {
                        presetProvider: ['p1', 'p2']
                    }
                })
            }
        });
        const opts = await loadBootstrapOptions('root/')
        expect(opts.presetProvider.length).toBe(2);
        done();
    });

    afterEach(() => {
        mockFs.restore();
    })

});