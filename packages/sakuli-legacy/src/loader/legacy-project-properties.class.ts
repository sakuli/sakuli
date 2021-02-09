import {
  BooleanProperty,
  ifPresent,
  Maybe,
  NumberProperty,
  StringProperty,
} from "@sakuli/commons";
import { Browsers } from "../context/selenium-config/create-driver-from-project.function";
import { ScreenshotFolderStructure } from "../context/common/test-case/screenshot-folder-structure.interface";

export class LegacyProjectProperties {
  /**
   *
   */
  @StringProperty("testsuite.id")
  testsuiteId: string = "";

  /**
   * Descriptive name for the current test suite
   * DEFAULT: value of 'testsuite.id'
   */
  @StringProperty("testsuite.name")
  testsuiteName: string = "${testsuite.id}";

  /**
   * The warning runtime threshold (seconds) estimates the execution time of the complete
   * test suite. If the warning time is exceeded, the test suite will get the state
   * 'WARNING'.
   * If the threshold is set to 0, the execution time will never exceed, so the state will be always OK!
   * DEFAULT:0
   */
  @NumberProperty("testsuite.warningTime")
  testsuiteWarningTime: number = 0;

  /**
   * The critical runtime threshold (seconds) estimates the execution time of the complete
   * test suite. If the critical time is exceeded, the test suite will get the state
   * 'CRITICAL'.
   * If the threshold is set to 0, the execution time will never exceed, so the state will be always OK!
   * DEFAULT:0
   */
  @NumberProperty("testsuite.criticalTime")
  testsuiteCriticalTime: number = 0;

  /**
   * Defines the browser in witch the test suite should be executed
   * This option is usually defined via commandline and will override [testsuiteBrowser]{@link LegacyProjectProperties.testsuiteBrowser}
   *
   * To access the actual set browser within Sakuli use [getBrowser()]{@link LegacyProjectProperties.getBrowser}
   *
   * Possible values are defined in [Browsers]{@link Browsers} type
   *
   */
  @StringProperty("browser")
  browser: Maybe<Browsers>;

  /**
   * Defines the browser in witch the test suite should be executed
   * This option is usually defined in `sakuli.properties` or `testsuite.properties` file and can be overridden by [browser]{@link LegacyProjectProperties.browser}
   *
   * To access the actual set browser within Sakuli use [getBrowser()]{@link LegacyProjectProperties.getBrowser}
   *
   * Possible values are defined in [Browsers]{@link Browsers} type
   *
   */
  @StringProperty("testsuite.browser")
  testsuiteBrowser: Maybe<Browsers>;

  /**
   * Will return the browser to use with Sakuli based on configuration. It will return value of
   *
   * - [`browser`]{@link LegacyProjectProperties.browser} property if set
   * - otherwise [`testsuite.browser`]{@link LegacyProjectProperties.testsuiteBrowser} if set
   * - other `"firefox"`
   *
   * @returns Browsers - a valid browser string that can be used by selenium
   */
  getBrowser(): Browsers {
    return this.browser || this.testsuiteBrowser || "firefox";
  }

  /**
   * Defines whether the browser should be reused after a test suite or a new browser session should be created
   * This option is usually defined via commandline and will override [testsuiteReuseBrowser]{@link LegacyProjectProperties.testsuiteReuseBrowser}
   *
   * To access the actual set browser within Sakuli use [isReuseBrowser()]{@link LegacyProjectProperties.isReuseBrowser}
   */
  @BooleanProperty("reuseBrowser")
  reuseBrowser: Maybe<boolean>;

  /**
   * Defines whether the browser should be reused after a test suite or a new browser session should be created
   * This option is usually defined in `sakuli.properties` or `testsuite.properties` file and can be overridden by [reuseBrowser]{@link LegacyProjectProperties.reuseBrowser}
   *
   * To access the actual set browser within Sakuli use [isReuseBrowser()]{@link LegacyProjectProperties.isReuseBrowser}
   */
  @BooleanProperty("testsuite.reuseBrowser")
  testsuiteReuseBrowser: Maybe<boolean>;

  /**
   * Determines if a testsuite should reuse the browser session between testcases
   *
   * - [`reuseBrowser`]{@link LegacyProjectProperties.reuseBrowser} property if set
   * - otherwise [`testsuite.reuseBrowser`]{@link LegacyProjectProperties.testsuiteReuseBrowser} if set
   * - other `true`
   *
   * @return boolean
   */
  isReuseBrowser(): boolean {
    return ifPresent(
      this.reuseBrowser,
      (reuseBrowser) => reuseBrowser,
      () =>
        ifPresent(
          this.testsuiteReuseBrowser,
          (reuseBrowser) => reuseBrowser,
          () => true
        )
    );
  }

  /**
     * Determines if a testsuite should run in ui-only mode or not
     * This option is usually defined via commandline and will override [testSuiteUiOnly]{@link LegacyProjectProperties.testSuiteUiOnly}

     *
     * To access the actual set browser within Sakuli use [isUiOnly()]{@link LegacyProjectProperties.isUiOnly}
     *
     * Possible values are defined in [Browsers]{@link Browsers} type
     *
     */
  @BooleanProperty("ui-only")
  uiOnly: Maybe<boolean>;

  /**
   * Defines the browser in witch the test suite should be executed
   * This option is usually defined in `sakuli.properties` or `testsuite.properties` file and can be overridden by [uiOnly]{@link LegacyProjectProperties.uiOnly}
   *
   * To access the actual set browser within Sakuli use [isUiOnly()]{@link LegacyProjectProperties.isUiOnly}
   *
   */
  @BooleanProperty("testsuite.uiOnly")
  testSuiteUiOnly: Maybe<boolean>;

  /**
   * Determines if a testsuite should run in ui-only mode or not
   *
   * - [`uiOnly`]{@link LegacyProjectProperties.uiOnly} property if set
   * - otherwise [`testsuite.uiOnly`]{@link LegacyProjectProperties.testSuiteUiOnly} if set
   * - other `false`
   *
   * @return boolean
   */
  isUiOnly(): boolean {
    return ifPresent(
      this.uiOnly,
      (uiOnly) => uiOnly,
      () =>
        ifPresent(
          this.testSuiteUiOnly,
          (tsUiOnly) => tsUiOnly,
          () => false
        )
    );
  }

  /**
   * Disables the automatic iteration of frames.
   * If this is enabled, switching frames needs to be done manually via the webdriver.
   * For further information click [here](https://sakuli.io/docs/cookbook/frames/).
   *
   *
   * Default value: false
   */
  @BooleanProperty("testsuite.manualFrames.enabled")
  manualFrames: boolean = false;

  /**
   */
  @NumberProperty("sakuli.environment.similarity.default")
  sakuliEnvironmentSimilarityDefault: number = 0.99;

  /**
   * DEFAULT: false
   */
  @BooleanProperty("sakuli.autoHighlight")
  sakuliAutoHighlight: boolean = false;

  /**
   * Auto highlight duration (float)
   */
  @NumberProperty("sakuli.highlight.seconds")
  sakuliHighlightSeconds: number = 0.2;

  /**
   * Type delay - specifies the amount of time in ms to wait between keypresses
   */
  @NumberProperty("sakuli.typeDelay")
  typeDelay: number = 300;

  /**
   * Overwrite this property or use the environment var `SAKULI_ENCRYPTION_KEY` as master key for en- and decryption
   */
  @StringProperty("sakuli.encryption.key")
  sakuliEncryptionKey: string = "";

  /**
   * Enable / disable screenshots on error
   */
  @BooleanProperty("sakuli.screenshot.onError")
  errorScreenshot: boolean = true;

  /**
   * folder for screenshot files (if activated)
   */
  @StringProperty("sakuli.screenshot.dir")
  screenshotDir: string = "${sakuli.log.folder}/_screenshots";

  /**
   * The way error screenshots are stored on the harddrive.
   */
  @StringProperty("sakuli.screenshot.storage")
  screenshotStorage: ScreenshotFolderStructure = "hierarchical";

  /**
   * Delay between mouse actions e.g. mouse button down, mouse button up, scroll, etc. in ms
   */
  @NumberProperty("sakuli.mouse.action.delay")
  @NumberProperty("sakuli.clickDelay")
  mouseActionDelay: number = 10;

  /**
   * Configures the speed in pixels/second for mouse movement
   */
  @NumberProperty("sakuli.mouse.movement.speed")
  mouseSpeed: number = 3000;
}
