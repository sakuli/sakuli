import {loadPresets} from "./load-presets.function";

describe('loadPreset', () => {
    it('should load presets as modules', async done => {
        const presets = await loadPresets([
            'with-default',
        ]);
        expect(presets.length).toBe(1);
        done();
    });

    it('should silently ignore modules without default export', async done => {
        const presets = await loadPresets([
            'without-default',
        ]);
        expect(presets.length).toBe(0);
        done();
    })

    it('should silently ignore modules without default export', async done => {
        const presets = await loadPresets([
            'with-non-function-default',
        ]);
        expect(presets.length).toBe(0);
        done();
    })

    it('should throw if a module is not existing', async done => {
        try {
            await loadPresets([
                'non-existing-module',
            ]);
            done.fail();
        } catch (e) {
            done();
        }
    });
});