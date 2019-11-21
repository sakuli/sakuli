import { EnterpriseAnswers } from "./enterprise-answers.interface"
import { getBootstrapTasks } from "./get-bootstrap-tasks.function"
import { npmGlobalTask, licenseGlobalTask, getPackageBootstrapTasks } from "./tasks"
import { FeatureChoices } from "./feature-choices.const"
import { stringLiteral } from "@babel/types"


jest.mock('./tasks', () => ({
    oraTask: jest.fn(),
    npmGlobalTask: jest.fn(),
    licenseGlobalTask: jest.fn(),
    getPackageBootstrapTasks: jest.fn().mockReturnValue(Array.from({ length: 3 })),
}))

describe('getBootstrapTasks', () => {

    it('should return an empty task list when the user has no license', () => {

        // GIVEN
        const answers: EnterpriseAnswers = {
            features: [],
            hasLicense: false,
            npmKey: 'npm-key',
            licenseKey: 'license-key'
        }

        // WHEN
        const tasks = getBootstrapTasks(answers)

        // THEN
        expect(tasks.length).toBe(0);
    })

    it('should configure npm config task and licence config task', () => {

        // GIVEN
        const answers: EnterpriseAnswers = {
            features: [],
            hasLicense: true,
            npmKey: 'npm-key',
            licenseKey: 'license-key'
        }

        // WHEN
        const tasks = getBootstrapTasks(answers)

        // THEN
        expect(tasks.length).toBe(2);
        expect(npmGlobalTask).toHaveBeenCalledWith(answers.npmKey)
        expect(licenseGlobalTask).toHaveBeenCalledWith(answers.licenseKey)
    })

    test.each(<([string, string, Record<string, string>][])>[
        [FeatureChoices.Icinga2, '@sakuli/forwarder-icinga2', { "sakuli.forwarder.icinga2.enabled": "true" }],
        [FeatureChoices.OMD, '@sakuli/forwarder-gearman', { "sakuli.forwarder.gearman.enabled": "true" }],
        [FeatureChoices.CheckMk, '@sakuli/forwarder-checkmk', { "sakuli.forwarder.check_mk.enabled": "true" }]
    ])('when user choosed "%s" package %s should installed with at least %s', (
        answer,
        packageName,
        minimumConfig
    ) => {
        // GIVEN
        const answers: EnterpriseAnswers = {
            features: [
                answer
            ],
            hasLicense: false,
            npmKey: 'npm-key',
            licenseKey: 'license-key'
        }

        // WHEN
        const tasks = getBootstrapTasks(answers);

        // THEN
        expect(getPackageBootstrapTasks).toHaveBeenCalledWith(packageName, expect.objectContaining(minimumConfig));
    })
})
