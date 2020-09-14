import { LegacyProjectProperties } from "./legacy-project-properties.class";

describe("LegacyProjectProperties", () => {
  let props: LegacyProjectProperties;
  beforeEach(() => {
    props = new LegacyProjectProperties();
  });

  describe("getBrowser", () => {
    it("should return browser value if set", () => {
      props.browser = "chrome";
      expect(props.getBrowser()).toEqual("chrome");
    });

    it("should return browser value if set", () => {
      props.testsuiteBrowser = "chrome";
      expect(props.getBrowser()).toEqual("chrome");
    });

    it("should return browser value if set regardless of testsuiteBrowser value", () => {
      props.browser = "chrome";
      props.testsuiteBrowser = "ie";
      expect(props.getBrowser()).toEqual("chrome");
    });

    it("should return firefox as default", () => {
      expect(props.getBrowser()).toEqual("firefox");
    });
  });

  describe("isUiOnly", () => {
    it("should return false by default", () => {
      expect(props.isUiOnly()).toBe(false);
    });

    it("should return uiOnly when set", () => {
      props.uiOnly = true;
      expect(props.isUiOnly()).toBe(true);
    });

    it("should return uiOnly if set even testsuiteUiOnly is set", () => {
      props.uiOnly = false;
      props.testSuiteUiOnly = true;
      expect(props.isUiOnly()).toBe(false);
    });

    it("should return testSuiteUiOnly", () => {
      props.testSuiteUiOnly = true;
      expect(props.isUiOnly()).toBe(true);
    });
  });

  describe("isBrowserReuse", () => {
    it("should return true by default", () => {
      expect(props.isBrowserReuse()).toBe(true);
    });

    it("should return browserReuse when set", () => {
      props.browserReuse = true;
      expect(props.isBrowserReuse()).toBe(true);
    });

    it("should return browserReuse if set even testsuiteBrowserReuse is set", () => {
      props.browserReuse = false;
      props.testsuiteBrowserReuse = true;
      expect(props.isBrowserReuse()).toBe(false);
    });

    it("should return testsuiteBrowserReuse", () => {
      props.testsuiteBrowserReuse = true;
      expect(props.isBrowserReuse()).toBe(true);
    });
  });
});
