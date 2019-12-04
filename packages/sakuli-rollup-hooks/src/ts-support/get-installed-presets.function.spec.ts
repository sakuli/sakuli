import { getInstalledPresets } from "./get-installed-presets.function";
import { readJson } from '../read-json.function'

jest.mock('../read-json.function.ts', () => {
    return ({
        readJson: jest.fn((path: string) => {
            if(path.endsWith('/valid/package.json')) {
                return Promise.resolve({
                    "sakuli": { "presetProvider": [
                        "@sakuli/legacy"
                    ]}
                });
            }
            if(path.endsWith('/invalid/package.json')) {
                return Promise.reject();
            }
            if(path.endsWith('/missing-sakuli-key/package.json')) {
                return Promise.resolve({

                })
            }
        })
    })
})

describe('getInstalledPresets', () => {

    it('should read one preset from valid json', async () => {
        const presets = await getInstalledPresets('/valid');
        expect(readJson).toHaveBeenCalledWith('/valid/package.json');
        expect(presets.length).toBe(1);
        expect(presets).toEqual(expect.arrayContaining(['@sakuli/legacy']));
    });

    it('should return fallback array when readJson throws', async () => {
        const presets = await getInstalledPresets('/invalid');
        expect(readJson).toHaveBeenCalledWith('/invalid/package.json');
        expect(presets.length).toBe(1);
        expect(presets).toEqual(expect.arrayContaining(['@sakuli/legacy']))
    });

    it('should return fallback array when json doesn\'t have sakuli property', async () => {
        const presets = await getInstalledPresets('/missing-sakuli-key');
        expect(readJson).toHaveBeenCalledWith('/missing-sakuli-key/package.json');
        expect(presets.length).toBe(1);
        expect(presets).toEqual(expect.arrayContaining(['@sakuli/legacy']))
    });
});
