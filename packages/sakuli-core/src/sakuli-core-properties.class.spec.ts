import { SakuliCoreProperties } from "./sakuli-core-properties.class";
import { LogMode } from "./log-mode";

describe("sakuli-core-properties", () => {
  describe("getLogMode", () => {
    it("should return 'logfile' as default", () => {
      // GIVEN
      const coreProps = new SakuliCoreProperties();
      const expectedLogMode = LogMode.LOG_FILE;

      // WHEN
      const logMode = coreProps.getLogMode();

      // THEN
      expect(logMode).toBe(expectedLogMode);
    });

    it("should return value from properties config", () => {
      // GIVEN
      const coreProps = new SakuliCoreProperties();
      const expectedLogMode = LogMode.CI;
      coreProps.logMode = LogMode.CI;

      // WHEN
      const logMode = coreProps.getLogMode();

      // THEN
      expect(logMode).toBe(expectedLogMode);
    });

    it("should return value from environment config", () => {
      // GIVEN
      const coreProps = new SakuliCoreProperties();
      const expectedLogMode = LogMode.CI;
      coreProps.logModeEnv = "ci";

      // WHEN
      const logMode = coreProps.getLogMode();

      // THEN
      expect(logMode).toBe(expectedLogMode);
    });

    it("should return value of property file over env variable", () => {
      const coreProps = new SakuliCoreProperties();
      const expectedLogMode = LogMode.CI;
      coreProps.logModeEnv = "logfile";
      coreProps.logMode = LogMode.CI;

      // WHEN
      const logMode = coreProps.getLogMode();

      // THEN
      expect(logMode).toBe(expectedLogMode);
    });
  });
});
