import { installPackageTask } from "./install-package-task.function"

jest.mock('execa', () => jest.fn())

import execa from "execa";
describe('installPackageTask', () => {
    it('should run npm install on given paackage', async () => {
        // GIVEN
        const task = installPackageTask('package');

        // WHEN
        await task();

        // THEN
        expect(execa).toHaveBeenCalledWith('npm', ['i', 'package']);
    })
})

