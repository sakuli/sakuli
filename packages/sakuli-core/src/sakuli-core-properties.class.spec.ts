import { SakuliCoreProperties } from "./sakuli-core-properties.class";

describe("sakuli-core-properties", () => {
  describe("getLogMode", () => {
    it("should return 'logfile' as default", () => {
      // GIVEN
      const coreProps = new SakuliCoreProperties();
      const expectedLogMode = "logfile";

      // WHEN
      const logMode = coreProps.getLogMode();

      // THEN
      expect(logMode).toBe(expectedLogMode);
    });

    it("should return value from properties config", () => {
      // GIVEN
      const coreProps = new SakuliCoreProperties();
      const expectedLogMode = "ci";
      coreProps.logMode = expectedLogMode;

      // WHEN
      const logMode = coreProps.getLogMode();

      // THEN
      expect(logMode).toBe(expectedLogMode);
    });

    it("should return value from environment config", () => {
      // GIVEN
      const coreProps = new SakuliCoreProperties();
      const expectedLogMode = "ci";
      coreProps.logModeEnv = expectedLogMode;

      // WHEN
      const logMode = coreProps.getLogMode();

      // THEN
      expect(logMode).toBe(expectedLogMode);
    });
  });
});
