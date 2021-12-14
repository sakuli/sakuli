import { ModuleAnswers } from "./module-answers.interface";
import { getBootstrapTasks } from "./get-bootstrap-tasks.function";
import { ConfigurationRecord, getPackageBootstrapTasks, } from "./tasks";
import { ModuleChoices } from "./module-choices.const";

jest.mock("./tasks", () => {
  const originalModule = jest.requireActual("./tasks");

  return {
    __esModule: true,
    ...originalModule,
    oraTask: jest.fn(),
    getPackageBootstrapTasks: jest
      .fn()
      .mockReturnValue(Array.from({ length: 3 })),
  };
});

describe("getBootstrapTasks", () => {

  it("should configure npm config task and licence config task", () => {
    // GIVEN
    const answers: ModuleAnswers = {
      features: []
    };

    // WHEN
    const tasks = getBootstrapTasks(answers);

    // THEN
    expect(tasks.length).toBe(2);
  });

  test.each(<[string, string, ConfigurationRecord][]>[
    [
      ModuleChoices.Prometheus,
      "@sakuli/forwarder-prometheus",
      {
        "sakuli.forwarder.prometheus.enabled": {
          isComment: false,
          value: "true",
        },
      },
    ],
    [
      ModuleChoices.Icinga2,
      "@sakuli/forwarder-icinga2",
      {
        "sakuli.forwarder.icinga2.enabled": { isComment: false, value: "true" },
      },
    ],
    [
      ModuleChoices.OMD,
      "@sakuli/forwarder-gearman",
      {
        "sakuli.forwarder.gearman.enabled": { isComment: false, value: "true" },
      },
    ],
    [
      ModuleChoices.CheckMk,
      "@sakuli/forwarder-checkmk",
      {
        "sakuli.forwarder.check_mk.enabled": {
          isComment: false,
          value: "true",
        },
      },
    ],
    [ModuleChoices.OCR, "@sakuli/ocr", {}],
  ])(
    'when user choosed "%s" package %s should installed with at least %s',
    (answer, packageName, minimumConfig) => {
      // GIVEN
      const answers: ModuleAnswers = {
        features: [answer]
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
