jest.mock("./common/button-registry");
jest.mock("./common/release-keys.function");

import { LegacyLifecycleHooks } from "./legacy-lifecycle-hooks.class";
import {
  Builder,
  Capabilities,
  Options,
  ThenableWebDriver,
  Window,
} from "selenium-webdriver";
import { mockPartial } from "sneer";
import { LegacyProjectProperties } from "../loader/legacy-project-properties.class";
import {
  nodeSignals,
  Project,
  TestExecutionContext,
  TestFile,
} from "@sakuli/core";
import {
  createPropertyMapMock,
  createTestExecutionContextMock,
} from "./__mocks__";
import { releaseKeys } from "./common/release-keys.function";
import { Key, MouseButton } from "./common";
import { getActiveKeys } from "./common/button-registry";
import mockFs from "mock-fs";
import Mock = jest.Mock;
import Signals = NodeJS.Signals;

describe("LegacyLifecycleHooks", () => {
  let builder: Builder;
  let lcp: LegacyLifecycleHooks;
  let window: Window;
  let options: Options;
  let driver: ThenableWebDriver;
  let minimumProject: Project;
  let testExecutionContext: TestExecutionContext;
  let legacyProps: LegacyProjectProperties;
  beforeEach(async () => {
    jest.clearAllMocks();

    window = mockPartial<Window>({
      maximize: jest.fn(),
    });

    options = mockPartial<Options>({
      window: jest.fn().mockReturnValue(window),
    });
    driver = mockPartial<ThenableWebDriver>({
      quit: jest.fn(),
      manage: jest.fn().mockReturnValue(options),
    });

    testExecutionContext = createTestExecutionContextMock();

    legacyProps = new LegacyProjectProperties();
    legacyProps.testsuiteBrowser = "chrome";
    minimumProject = mockPartial<Project>({
      rootDir: "",
      testFiles: [],
      objectFactory: jest.fn().mockReturnValue(legacyProps),
      ...createPropertyMapMock({}),
    });

    builder = mockPartial<Builder>({
      forBrowser: jest.fn(() => builder),
      withCapabilities: jest.fn(() => builder),
      setChromeOptions: jest.fn(() => builder),
      setSafariOptions: jest.fn(() => builder),
      setIeOptions: jest.fn(() => builder),
      setFirefoxOptions: jest.fn(() => builder),
      build: jest.fn(() => driver),
      setLoggingPrefs: jest.fn(() => builder),
    });
    lcp = new LegacyLifecycleHooks(builder);
  });

  afterEach(() => {});

  describe("Sahi Api", () => {
    it("should init webdriver with builder", async () => {
      await lcp.onProject(minimumProject, testExecutionContext);
      expect(builder.forBrowser).toHaveBeenCalledWith("chrome");
      await expect(builder.withCapabilities).toHaveBeenCalledWith(
        Capabilities.chrome()
      );
    });

    it("should maximize browser after init", async () => {
      await lcp.onProject(minimumProject, testExecutionContext);
      expect(window.maximize).toHaveBeenCalled();
    });

    it("should publish sahi function into context", async () => {
      await lcp.onProject(minimumProject, testExecutionContext);
      lcp.currentTest = "/some/where/over/the/rainbow";
      const context = await lcp.requestContext(
        testExecutionContext,
        minimumProject
      );
      return expect(context._navigateTo).toBeDefined();
    });

    it("should quit the webdriver in teardown", async () => {
      await lcp.onProject(minimumProject, testExecutionContext);
      await expect(lcp.driver).toBeDefined();
      jest.spyOn(lcp.driver!, "quit");
      await lcp.afterExecution(minimumProject, testExecutionContext);
      expect(lcp.driver!.quit).toHaveBeenCalled();
      expect(testExecutionContext.logger.debug).toHaveBeenCalledWith(
        "Closed webdriver"
      );
    });

    it("should log in case the webdriver in teardown errored", async () => {
      //GIVEN
      await lcp.onProject(minimumProject, testExecutionContext);
      await expect(lcp.driver).toBeDefined();
      const expectedError = Error("Oh no! Quit did some fuxi wuxi =/");
      lcp.driver!.quit = jest.fn().mockRejectedValue(expectedError);

      //THEN
      await lcp.afterExecution(minimumProject, testExecutionContext);

      //WHEN
      expect(testExecutionContext.logger.warn).toHaveBeenCalledWith(
        "Webdriver doesn't quit reliably",
        expectedError
      );
    });
  });

  describe("Lifecycle", () => {
    it("should set case id by file name", async () => {
      const file: TestFile = {
        path: "my-suite/my-case/case1.js",
      };
      (testExecutionContext.getCurrentTestCase as Mock).mockReturnValue({});
      await lcp.afterRunFile(file, minimumProject, testExecutionContext);
      expect(testExecutionContext.updateCurrentTestCase).toHaveBeenCalledWith(
        expect.objectContaining({ id: "case1" })
      );
    });

    it("should set suite id by property", async () => {
      //GIVEN
      legacyProps.testsuiteId = "from-property";
      (testExecutionContext.getCurrentTestCase as Mock).mockReturnValue({});
      await lcp.onProject(minimumProject, testExecutionContext);

      //WHEN
      await lcp.beforeExecution(minimumProject, testExecutionContext);

      //THEN
      expect(testExecutionContext.startTestSuite).toHaveBeenCalledWith(
        expect.objectContaining({ id: "from-property" })
      );
    });

    it("should set warning time by property, critical time defaults to 0", async () => {
      // GIVEN
      const warningTimeFromProps = 10;
      legacyProps.testsuiteId = "from-property";
      legacyProps.testsuiteWarningTime = warningTimeFromProps;
      (testExecutionContext.getCurrentTestCase as Mock).mockReturnValue({});
      await lcp.onProject(minimumProject, testExecutionContext);

      // WHEN
      await lcp.beforeExecution(minimumProject, testExecutionContext);

      // THEN
      expect(testExecutionContext.startTestSuite).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "from-property",
          warningTime: warningTimeFromProps,
          criticalTime: 0,
        })
      );
    });

    it("should set critical time by property, warning time defaults to 0", async () => {
      // GIVEN
      const criticalTimeFromProps = 10;
      legacyProps.testsuiteId = "from-property";
      legacyProps.testsuiteCriticalTime = criticalTimeFromProps;
      (testExecutionContext.getCurrentTestCase as Mock).mockReturnValue({});
      await lcp.onProject(minimumProject, testExecutionContext);

      // WHEN
      await lcp.beforeExecution(minimumProject, testExecutionContext);

      // THEN
      expect(testExecutionContext.startTestSuite).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "from-property",
          warningTime: 0,
          criticalTime: criticalTimeFromProps,
        })
      );
    });

    it("should set both warning and critical time by property", async () => {
      // GIVEN
      const warningTimeFromProps = 5;
      const criticalTimeFromProps = 10;
      legacyProps.testsuiteId = "from-property";
      legacyProps.testsuiteWarningTime = warningTimeFromProps;
      legacyProps.testsuiteCriticalTime = criticalTimeFromProps;
      (testExecutionContext.getCurrentTestCase as Mock).mockReturnValue({});
      await lcp.onProject(minimumProject, testExecutionContext);

      // WHEN
      await lcp.beforeExecution(minimumProject, testExecutionContext);

      // THEN
      expect(testExecutionContext.startTestSuite).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "from-property",
          warningTime: warningTimeFromProps,
          criticalTime: criticalTimeFromProps,
        })
      );
    });
  });

  describe("ui-only scenario", () => {
    const legacyProps = new LegacyProjectProperties();
    legacyProps.uiOnly = true;
    const uiOnlyProject = mockPartial<Project>({
      rootDir: "",
      testFiles: [],
      objectFactory: jest.fn().mockReturnValue(legacyProps),
      ...createPropertyMapMock({}),
    });
    it("should prepare context for UI-Only test", async () => {
      await lcp.onProject(uiOnlyProject, testExecutionContext);
      expect(lcp.uiOnly).toBeTruthy();
      expect(builder.build).toHaveBeenCalledTimes(0);
      expect(lcp.driver).toBeNull();
    });

    it("should create a context without sahi api", async () => {
      await lcp.onProject(uiOnlyProject, testExecutionContext);
      lcp.currentTest = "";
      const context = await lcp.requestContext(
        testExecutionContext,
        uiOnlyProject
      );
      expect(context.driver).toBeNull();
      expect(() => {
        context._navigateTo("");
      }).toThrowError(/_navigateTo/);
    });
  });

  describe("signals", () => {
    it.each(["SIGINT", "SIGTERM"] as Signals[])(
      "should release pressed keys on %s",
      (signal) => {
        //GIVEN
        const expectedButtonRegistry = {
          keyboard: [Key.ALT, Key.SHIFT],
          mouse: [MouseButton.RIGHT, MouseButton.LEFT],
        };
        (getActiveKeys as jest.Mock).mockImplementation(
          () => expectedButtonRegistry
        );

        //WHEN
        lcp.onSignal(signal, minimumProject, testExecutionContext);

        //THEN
        expect(releaseKeys).toBeCalledWith(
          expectedButtonRegistry,
          expect.anything(),
          expect.anything()
        );
      }
    );

    it.each(
      nodeSignals.filter(
        (signal) => signal !== "SIGINT" && signal !== "SIGTERM"
      )
    )("should not release pressed keys on %s", (signal) => {
      //GIVEN
      const expectedButtonRegistry = {
        keyboard: [Key.ALT, Key.SHIFT],
        mouse: [MouseButton.RIGHT, MouseButton.LEFT],
      };
      (getActiveKeys as jest.Mock).mockImplementation(
        () => expectedButtonRegistry
      );

      //WHEN
      lcp.onSignal(signal, minimumProject, testExecutionContext);

      //THEN
      expect(releaseKeys).not.toBeCalled();
    });
  });

  it("should release pressed keys on onUnhandledError", () => {
    //GIVEN
    const expectedButtonRegistry = {
      keyboard: [Key.ALT, Key.SHIFT],
      mouse: [MouseButton.RIGHT, MouseButton.LEFT],
    };
    (getActiveKeys as jest.Mock).mockImplementation(
      () => expectedButtonRegistry
    );

    //WHEN
    lcp.onUnhandledError(Error("foo"), minimumProject, testExecutionContext);

    //THEN
    expect(releaseKeys).toBeCalledWith(
      expectedButtonRegistry,
      expect.anything(),
      expect.anything()
    );
  });

  describe("browser reuse is deactivated", () => {
    let browserReuseProps = new LegacyProjectProperties();
    browserReuseProps.reuseBrowser = false;
    let browserReuseProject = mockPartial<Project>({
      rootDir: "",
      testFiles: [],
      objectFactory: jest.fn().mockReturnValue(browserReuseProps),
      ...createPropertyMapMock({}),
    });
    const file: TestFile = {
      path: "my-suite/my-case/case1.js",
    };
    mockFs({
      "my-suite/my-case": {
        "case1.js": {},
      },
    });

    afterAll(() => {
      mockFs.restore();
    });

    it("should not build webdriver onProject", async () => {
      // WHEN
      await lcp.onProject(browserReuseProject, testExecutionContext);

      // THEN
      expect(builder.build).not.toHaveBeenCalled();
      expect(lcp.driver).toBeNull();
    });

    it("should build webdriver beforeRunFile", async () => {
      // GIVEN
      await lcp.onProject(browserReuseProject, testExecutionContext);

      // WHEN
      await lcp.beforeRunFile(file, browserReuseProject, testExecutionContext);

      // THEN
      expect(builder.build).toHaveBeenCalledTimes(1);
    });

    it("should quit webdriver afterRunFile", async () => {
      // GIVEN
      await lcp.onProject(browserReuseProject, testExecutionContext);
      await lcp.beforeRunFile(file, browserReuseProject, testExecutionContext);

      // WHEN
      await lcp.afterRunFile(file, browserReuseProject, testExecutionContext);

      // THEN
      expect(driver.quit).toHaveBeenCalledTimes(1);
    });

    it("should not quit webdriver afterExecution", async () => {
      // GIVEN
      await lcp.onProject(browserReuseProject, testExecutionContext);

      // WHEN
      await lcp.afterExecution(browserReuseProject, testExecutionContext);

      // THEN
      expect(driver.quit).not.toHaveBeenCalled();
    });
  });
});
