import { getSakuliVersion } from "./get-sakuli-version.function"
import { readJson } from "../read-json.function"
import { join } from "path"
const execa: jest.Mock = require("execa");

jest.mock('../read-json.function.ts', () => ({
    readJson: jest.fn()
}))

jest.mock('execa', () => jest.fn());

describe('getSakuliVersion', () => {

    beforeEach(() => {
        jest.spyOn(console, 'debug');
    });

    afterEach(() => {
        jest.resetAllMocks();
    })

    it('should use version from dependencies in package.json', async () => {
        (<jest.Mock>readJson).mockResolvedValueOnce({
            dependencies: { '@sakuli/cli': '2.2.0-file' },
            devDependencies: { '@sakuli/cli': '2.2.0-dev' }
        });
        const version = await getSakuliVersion('some/path');
        expect(version).toBe('2.2.0-file');
        expect(readJson).toHaveBeenCalledWith(join('some/path', 'package.json'));
        expect(console.debug).not.toHaveBeenCalled();
    })

    it('should use version from devDependencies in package.json when not in dependencies', async () => {
        (<jest.Mock>readJson).mockResolvedValueOnce({
            devDependencies: { '@sakuli/cli': '2.2.0-dev' }
        });
        const version = await getSakuliVersion('some/path');
        expect(version).toBe('2.2.0-dev');
        expect(readJson).toHaveBeenCalledWith(join('some/path', 'package.json'));
    });

    it('should fallback to output of npx command when package.json cannot be read', async () => {
        (<jest.Mock>readJson).mockRejectedValue(null);
        (<jest.Mock>execa).mockResolvedValue({ stdout: '2.2.0-cli' });
        const version = await getSakuliVersion('some/path');
        expect(version).toBe('2.2.0-cli');
        expect(execa).toHaveBeenCalledWith('npx', ['sakuli', '--version'], expect.objectContaining({ cwd: 'some/path' }));
        expect(console.debug).toHaveBeenCalledTimes(1);
    });

    it('should fallback to output of npx command when sakuli is not in the dependencies', async () => {
        (<jest.Mock>readJson).mockRejectedValue({
            dependencies: {},
            devDependencies: {},
        });
        (<jest.Mock>execa).mockResolvedValue({ stdout: '2.2.0-cli' });
        const version = await getSakuliVersion('some/path');
        expect(version).toBe('2.2.0-cli');
        expect(execa).toHaveBeenCalledWith('npx', ['sakuli', '--version'], expect.objectContaining({ cwd: 'some/path' }));
        expect(console.debug).toHaveBeenCalledTimes(1);
    });

    it('should fallback to @latest when all other mechanisms not working', async () => {
        (<jest.Mock>readJson).mockRejectedValue(null);
        (<jest.Mock>execa).mockRejectedValue(null);
        const version = await getSakuliVersion('some/path');
        expect(version).toBe('latest');
        expect(console.debug).toHaveBeenCalledTimes(2);
    });
});
