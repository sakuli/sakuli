import { EnterpriseAnswers } from "./enterprise-answers.interface";
import { getBootstrapTasks } from "./get-bootstrap-tasks.function";
import {
  ConfigurationRecord,
  getPackageBootstrapTasks,
  licenseGlobalTask,
  npmGlobalTask,
} from "./tasks";
import { FeatureChoices } from "./feature-choices.const";

jest.mock("./tasks", () => {
  const originalModule = jest.requireActual("./tasks");

  return {
    __esModule: true,
    ...originalModule,
    oraTask: jest.fn(),
    npmGlobalTask: jest.fn(),
    licenseGlobalTask: jest.fn(),
    getPackageBootstrapTasks: jest
      .fn()
      .mockReturnValue(Array.from({ length: 3 })),
  };
});

describe("getBootstrapTasks", () => {
  it("should return an empty task list when the user has no license", () => {
    // GIVEN
    const answers: EnterpriseAnswers = {
      features: [],
      hasLicense: false,
      npmKey: "npm-key",
      licenseKey: "license-key",
    };

    // WHEN
    const tasks = getBootstrapTasks(answers);

    // THEN
    expect(tasks.length).toBe(0);
  });

  it("should configure npm config task and licence config task", () => {
    // GIVEN
    const answers: EnterpriseAnswers = {
      features: [],
      hasLicense: true,
      npmKey: "npm-key",
      licenseKey: "license-key",
    };

    // WHEN
    const tasks = getBootstrapTasks(answers);

    // THEN
    expect(tasks.length).toBe(2);
    expect(npmGlobalTask).toHaveBeenCalledWith(answers.npmKey);
    expect(licenseGlobalTask).toHaveBeenCalledWith(answers.licenseKey);
  });

  test.each(<[string, string, ConfigurationRecord][]>[
    [
      FeatureChoices.Icinga2,
      "@sakuli/forwarder-icinga2",
      {
        "sakuli.forwarder.icinga2.enabled": { isComment: false, value: "true" },
      },
    ],
    [
      FeatureChoices.OMD,
      "@sakuli/forwarder-gearman",
      {
        "sakuli.forwarder.gearman.enabled": { isComment: false, value: "true" },
      },
    ],
    [
      FeatureChoices.CheckMk,
      "@sakuli/forwarder-checkmk",
      {
        "sakuli.forwarder.check_mk.enabled": {
          isComment: false,
          value: "true",
        },
      },
    ],
  ])(
    'when user choosed "%s" package %s should installed with at least %s',
    (answer, packageName, minimumConfig) => {
      // GIVEN
      const answers: EnterpriseAnswers = {
        features: [answer],
        hasLicense: false,
        npmKey: "npm-key",
        licenseKey: "license-key",
      };

      // WHEN
      getBootstrapTasks(answers);

      // THEN
      expect(getPackageBootstrapTasks).toHaveBeenCalledWith(
        packageName,
        expect.objectContaining(minimumConfig)
      );
    }
  );
});
