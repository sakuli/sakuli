import {BooleanProperty, ListProperty,Maybe, Property, NumberProperty} from "@sakuli/commons";
import {IPerfLoggingPrefs} from "selenium-webdriver/chrome";

export class ChromeProperties {

    /**
     * Argument string passed to selenium chrome options.
     *
     * Arguments can be set as a string in the form of:
     * <code>
     * "--arg1 arg2 --arg3=value arg4=value"
     * </code>
     *
     * In the example the arguments arg1, arg2, arg3 and arg4 are passed
     * to chrome while arg3 and arg4 also have values
     *
     */
    @ListProperty('selenium.chrome.arguments', {delimiter: ' '})
    arguments: Maybe<string[]>;

    /**
     * If this property is set somehow (there is no negative or 'falsy' value), chromes headless option will be activated
     */
    @BooleanProperty('selenium.chrome.headless')
    headless: Maybe<Boolean>;

    /**
     * Sets the width of the chromes window on start
     * It's ignored when selenium.chrome.windowSize.height is not set
     */
    @NumberProperty('selenium.chrome.windowSize.width')
    windowSizeWidth: Maybe<number>;

    /**
     * Sets the height of the chromes window on start
     * It's ignored when selenium.chrome.windowSize.width is not set
     */
    @NumberProperty('selenium.chrome.windowSize.height')
    windowSizeHeight: Maybe<number>;

    /**
     * List of Chrome command line switches to exclude that ChromeDriver by
     * default passes when starting Chrome.  Do not prefix switches with '--'.
     */
    @ListProperty('selenium.chrome.excludeSwitches', {delimiter: ' '})
    excludeSwitches: Maybe<string[]>;

    /**
     * Add additional extensions to install when launching Chrome. Each extension
     * should be specified as the path to the packed CRX file
     */
    @ListProperty('selenium.chrome.extensions', {delimiter: ','})
    extensions: Maybe<string[]>;

    /**
     * Sets the path to the Chrome binary to use. On Mac OS X, this path should
     * reference the actual Chrome executable, not just the application binary
     * (e.g. '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome').
     *
     * The binary path be absolute or relative to the chromedriver server
     * executable, but it must exist on the machine that will launch Chrome.
     *
     */
    @Property('selenium.chrome.binaryPath')
    binaryPath: Maybe<string>;

    /**
     * Sets the user preferences for Chrome's user profile. See the 'Preferences'
     * file in Chrome's user data directory for examples.
     */
    @Property('selenium.chrome.userPreferences')
    userPreferences: Maybe<object>;

    /**
     * Complex value to set the performance logging preferences. Options include:
     *
     * - `enableNetwork`: Whether or not to collect events from Network domain.
     * - `enablePage`: Whether or not to collect events from Page domain.
     * - `enableTimeline`: Whether or not to collect events from Timeline domain.
     *     Note: when tracing is enabled, Timeline domain is implicitly disabled,
     *     unless `enableTimeline` is explicitly set to true.
     * - `tracingCategories`: A comma-separated string of Chrome tracing
     * categories for which trace events should be collected. An unspecified or
     * empty string disables tracing.
     * - `bufferUsageReportingInterval`: The requested number of milliseconds
     *     between DevTools trace buffer usage events. For example, if 1000, then
     *     once per second, DevTools will report how full the trace buffer is. If
     * a report indicates the buffer usage is 100%, a warning will be issued.
     *
     * Might be useless in Sakuli
     *
     */
    @Property('selenium.chrome.loggingPrefs')
    loggingPrefs: Maybe<IPerfLoggingPrefs>;

    /**
     * Sets preferences for the 'Local State' file in Chrome's user data
     * directory.
     */
    @Property('selenium.chrome.localState')
    localState: Maybe<object>


}
