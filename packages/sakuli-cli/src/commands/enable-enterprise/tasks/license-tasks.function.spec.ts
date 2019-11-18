import { licenseGlobalTask } from "./license-tasks.function";
import execa = require("execa");
import { promises as fs } from 'fs';
import { sep, join } from "path";
import { homedir } from "os";
jest.mock('execa', () => jest.fn());
jest.mock('os', () => ({
    homedir: jest.fn()
}))
const { tmpdir } = jest.requireActual('os');

describe('licenseGlobalTask', () => {

    afterEach(() => {
        jest.resetAllMocks();
    })

    describe('on win', () => {

        let platform: string;
        beforeEach(() => {
            platform = process.platform;
            Object.defineProperty(process, 'platform', {
                value: 'win32'
            })
        })

        it('should use setX command to set env var', async () => {
            // GIVEN
            const task = licenseGlobalTask('abcdefg');

            // WHEN
            await task();

            // THEN
            expect(execa).toHaveBeenCalledWith('setx', ['SAKULI_LICENSE_KEY=abcdefg'])

        })

        afterEach(() => {
            Object.defineProperty(process, 'platform', {
                value: platform
            })
        })

    })
    describe('on unix', () => {

        let platform: string;
        let tmpHomeDirMock: string;
        beforeEach(async () => {
            platform = process.platform;
            Object.defineProperty(process, 'platform', {
                value: 'linux'
            })
            tmpHomeDirMock = await fs.mkdtemp(`${tmpdir()}${sep}`);
            (<jest.Mock>homedir).mockReturnValue(tmpHomeDirMock);
        })

        it('should use add license env var to .bashrc', async () => {
            // GIVEN
            const task = licenseGlobalTask('abcdefg');

            // WHEN
            await task();

            // THEN
            const bashRcContent = await fs.readFile(join(tmpHomeDirMock, '.bashrc')).then(buf => buf.toString());
            expect(bashRcContent).toContain('exports SAKULI_LICENSE_KEY=abcdefg');
        })

        it('should use append license env var to .bashrc', async () => {
            // GIVEN
            await fs.writeFile(join(tmpHomeDirMock, '.bashrc'), '# something here')
            const task = licenseGlobalTask('abcdefg');

            // WHEN
            await task();

            // THEN
            const bashRcContent = await fs.readFile(join(tmpHomeDirMock, '.bashrc')).then(buf => buf.toString());
            expect(bashRcContent).toContain('# something here'); 
            expect(bashRcContent).toContain('exports SAKULI_LICENSE_KEY=abcdefg');
        })

        afterEach(() => {
            Object.defineProperty(process, 'platform', {
                value: platform
            })
        })

    })
})
