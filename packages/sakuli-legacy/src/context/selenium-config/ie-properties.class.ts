import {
  BooleanProperty,
  ListProperty,
  Maybe,
  NumberProperty,
  Property,
  StringProperty,
} from "@sakuli/commons";
import { ProxyConfig } from "selenium-webdriver";

export class IeProperties {
  /**
   * Whether to disable the protected mode settings check when the session is
   * created. Disbling this setting may lead to significant instability as the
   * browser may become unresponsive/hang. Only 'best effort' support is
   * provided when using this capability.
   *
   * For more information, refer to the IEDriver's
   * [required system configuration](http://goo.gl/eH0Yi3).
   */
  @BooleanProperty(
    "selenium.ie.introduceFlakinessByIgnoringProtectedModeSettings"
  )
  introduceFlakinessByIgnoringProtectedModeSettings: Maybe<boolean>;

  /**
   * Indicates whether to skip the check that the browser's zoom level is set to
   * 100%.
   */
  @BooleanProperty("selenium.ie.ignoreZoomSetting")
  ignoreZoomSetting: Maybe<boolean>;

  /**
   * Sets the initial URL loaded when IE starts. This is intended to be used
   * with
   * Setting this option may cause browser
   * instability or flaky and unresponsive code. Only 'best effort' support is
   * provided when using this option.
   */
  @StringProperty("selenium.ie.initialBrowserUrl")
  initialBrowserUrl: Maybe<string>;

  /**
   * Configures whether to enable persistent mouse hovering (true by default).
   * Persistent hovering is achieved by continuously firing mouse over events at
   * the last location the mouse cursor has been moved to.
   */
  @BooleanProperty("selenium.ie.enablePersistentHover")
  enablePersistentHover: Maybe<boolean>;

  /**
   * Configures whether the driver should attempt to remove obsolete
   * {@linkplain webdriver.WebElement WebElements} from its internal cache on
   * page navigation (true by default). Disabling this option will cause the
   * driver to run with a larger memory footprint.
   */
  @BooleanProperty("selenium.ie.enableElementCacheCleanup")
  enableElementCacheCleanup: Maybe<boolean>;

  /**
   * Configures whether to require the IE window to have input focus before
   * performing any user interactions (i.e. mouse or keyboard events). This
   * option is disabled by default, but delivers much more accurate interaction
   * events when enabled.
   */
  @BooleanProperty("selenium.ie.requireWindowFocus")
  requireWindowFocus: Maybe<boolean>;

  /**
   * Configures the timeout, in milliseconds, that the driver will attempt to
   * located and attach to a newly opened instance of Internet Explorer. The
   * default is zero, which indicates waiting indefinitely.
   */
  @NumberProperty("selenium.ie.browserAttachTimeout")
  browserAttachTimeout: Maybe<number>;

  /**
   * Configures whether to launch Internet Explorer using the CreateProcess API.
   * If this option is not specified, IE is launched using IELaunchURL, if
   * available. For IE 8 and above, this option requires the TabProcGrowth
   * registry value to be set to 0.
   */
  @BooleanProperty("selenium.ie.forceCreateProcessApi")
  forceCreateProcessApi: Maybe<boolean>;

  /**
   * Specifies command-line switches to use when launching Internet Explorer.
   * This is only valid when used with {@link #forceCreateProcessApi}.
   */
  @ListProperty("selenium.ie.arguments", { delimiter: " " })
  arguments: Maybe<string[]>;

  /**
   * Configures whether proxies should be configured on a per-process basis. If
   * not set, setting a {@linkplain #setProxy proxy} will configure the system
   * proxy. The default behavior is to use the system proxy.
   */
  @BooleanProperty("selenium.ie.usePerProcessProxy")
  usePerProcessProxy: Maybe<boolean>;

  /**
   * Configures whether to clear the cache, cookies, history, and saved form
   * data before starting the browser. _Using this capability will clear session
   * data for all running instances of Internet Explorer, including those
   * started manually.
   */
  @BooleanProperty("selenium.ie.ensureCleanSession")
  ensureCleanSession: Maybe<boolean>;

  /**
   * Sets the path to the log file the driver should log to.
   */
  @StringProperty("selenium.ie.logFile")
  logFile: Maybe<string>;

  /**
   * Sets the IEDriverServer's logging {@linkplain Level level}.
   */
  @StringProperty("selenium.ie.logLevel")
  logLevel: Maybe<string>;

  /**
   * Sets the IP address of the driver's host adapter.
   */
  @StringProperty("selenium.ie.host")
  host: Maybe<string>;

  /**
   * Sets the path of the temporary data directory to use.
   */
  @StringProperty("selenium.ie.extractPath")
  extractPath: Maybe<string>;

  /**
   * Sets whether the driver should start in silent mode.
   */
  @BooleanProperty("selenium.ie.silent")
  silent: Maybe<boolean>;

  /**
   * Sets the proxy settings for the new session.
   */
  @Property("selenium.ie.proxy")
  proxy: Maybe<ProxyConfig>;
}
