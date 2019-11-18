import { getPackageBootstrapTasks } from ".";
import { installPackageTask } from "./install-package-task.function";
import { configureFeatureTask } from "./configure-feature-task.function";
import { registerPackageTask } from "./register-package-task.function";

jest.mock('./configure-feature-task.function.ts', () => ({
    configureFeatureTask: jest.fn(),
}));

jest.mock('./register-package-task.function.ts', () => ({
    registerPackageTask: jest.fn(),
}))

jest.mock('./install-package-task.function.ts', () => ({
    installPackageTask: jest.fn(),
}))

describe("getPackageBootstrapTasks", () => {

    it('should return a list of three tasks', () => {
        const list = getPackageBootstrapTasks(
            'package',
            {}
        )

        expect(list.length).toBe(3);
    })


    it('should call proper task factories', () => {
        const config = {};
        const list = getPackageBootstrapTasks(
            'package',
            config
        )

        expect(installPackageTask).toHaveBeenCalledWith('package');
        expect(configureFeatureTask).toHaveBeenCalledWith(config);
        expect(registerPackageTask).toHaveBeenCalledWith('package');
    })

})
