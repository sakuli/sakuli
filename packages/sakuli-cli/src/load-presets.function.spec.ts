import {LICENSE_KEY, loadPresets} from "./load-presets.function";

describe('loadPreset', () => {
    it('should load presets as modules', async done => {
        const presets = await loadPresets([
            'with-default',
        ]);
        expect(presets.length).toBe(1);
        done();
    });

    it('should enable modules with valid token', async done => {
        process.env[LICENSE_KEY] = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzYWt1bGkuaW8iLCJzdWIiOiJzYWt1bGlfdXNlciIsImNhdGVnb3J5IjoxLCJuYmYiOjE1NjQwNDA4ODcsImV4cCI6MTcyMjA4NzIzMywiYXVkIjoia3VuZGUwODE1In0.CrU7CXpDr62lreHFV7FtkQvXsgQ0vmNS8xYvX5sjcxaOtBIFNaiAg60GKmKP72nMmYnMuzOEIJUW5eSpAbeKYQ";
        const presets = await loadPresets([
            'with-default-and-valid-token',
        ]);
        expect(presets.length).toBe(1);
        done();
    });

    it('should ignore modules with invalid category', async done => {
        process.env[LICENSE_KEY] = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzYWt1bGkuaW8iLCJzdWIiOiJzYWt1bGlfdXNlciIsImNhdGVnb3J5IjoxLCJuYmYiOjE1NjQwNDA4ODcsImV4cCI6MTcyMjA4NzIzMywiYXVkIjoia3VuZGUwODE1In0.CrU7CXpDr62lreHFV7FtkQvXsgQ0vmNS8xYvX5sjcxaOtBIFNaiAg60GKmKP72nMmYnMuzOEIJUW5eSpAbeKYQ";
        const presets = await loadPresets([
            'with-default-and-invalid-category',
        ]);
        expect(presets.length).toBe(0);
        done();
    });

    it('should ignore modules due to expired token', async done => {
        process.env[LICENSE_KEY] = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzYWt1bGkuaW8iLCJzdWIiOiJzYWt1bGlfdXNlciIsImNhdGVnb3J5IjoxLCJuYmYiOjE1NjQwNDA4ODcsImV4cCI6MTU2NDA0MDg4NywiYXVkIjoia3VuZGUwODE1In0.n6Q9N1I5wI-nJFiFsnA6q7hS7nwAmx_M5FXzWxlJRbHIfI_6LaMPL_nD_OsPwK9qUQw1uwMwOFpLOn5cbwbBUg";
        const presets = await loadPresets([
            'with-default-and-valid-token',
        ]);
        expect(presets.length).toBe(0);
        done();
    });

    it('should ignore modules due to not yet active token', async done => {
        process.env[LICENSE_KEY] = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzYWt1bGkuaW8iLCJzdWIiOiJzYWt1bGlfdXNlciIsImNhdGVnb3J5IjoxLCJuYmYiOjE3MjIwODcyMzMsImV4cCI6MTcyMjA4NzIzMywiYXVkIjoia3VuZGUwODE1In0.iVBPCFA3yT-BhKzVb469zEMsM170tqC-tE8u-0A25ojZc9dS7RIgACc_XwbQUuLpyEBdoLSqIqOIWJ6Fp_nlaA";
        const presets = await loadPresets([
            'with-default-and-valid-token',
        ]);
        expect(presets.length).toBe(0);
        done();
    });

    it('should ignore modules with invalid token', async done => {
        process.env[LICENSE_KEY] = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzYWt1bGkuaW8iLCJzdWIiOiJzYWt1bGlfdXNlciIsImNhdGVnb3J5IjoxLCJuYmYiOjE1NjQwNDA4ODcsImV4cCI6MTcyMjA4NzIzMywiYXVkIjoia3VuZGUwODE1In0.CrU7CXpDr62lreHFV7FtkQvXsgQ0vmNS8xYvX5sjcxaOtBIFNaiAg60GKmKP72nMmYnMuzOEIJUW5eSpAbeKYQ";
        const presets = await loadPresets([
            'with-default-and-invalid-token',
        ]);
        expect(presets.length).toBe(0);
        done();
    });

    it('should silently ignore modules without default export', async done => {
        const presets = await loadPresets([
            'without-default',
        ]);
        expect(presets.length).toBe(0);
        done();
    });

    it('should silently ignore modules without default export', async done => {
        const presets = await loadPresets([
            'with-non-function-default',
        ]);
        expect(presets.length).toBe(0);
        done();
    });

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