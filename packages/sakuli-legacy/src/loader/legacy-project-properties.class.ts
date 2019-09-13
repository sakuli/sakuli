import {BooleanProperty, NumberProperty, StringProperty, Maybe} from "@sakuli/commons";
import {Browsers} from "../context/selenium-config/create-driver-from-project.function";

export class LegacyProjectProperties {
    /**
     *
     */
    @StringProperty('testsuite.id')
    testsuiteId: string = "";

    /**
     * Descriptive name for the current test suite
     * DEFAULT: value of 'testsuite.id'
     */
    @StringProperty('testsuite.name')
    testsuiteName: string = "${testsuite.id}";

    /**
     * The warning runtime threshold (seconds) estimates the execution time of the complete
     * test suite. If the warning time is exceeded, the test suite will get the state
     * 'WARNING'.
     * If the threshold is set to 0, the execution time will never exceed, so the state will be always OK!
     * DEFAULT:0
     */
    @NumberProperty('testsuite.warningTime')
    testsuiteWarningTime: number = 0;

    /**
     * The critical runtime threshold (seconds) estimates the execution time of the complete
     * test suite. If the critical time is exceeded, the test suite will get the state
     * 'CRITICAL'.
     * If the threshold is set to 0, the execution time will never exceed, so the state will be always OK!
     * DEFAULT:0
     */
    @NumberProperty('testsuite.criticalTime')
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
    @StringProperty('browser')
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
    @StringProperty('testsuite.browser')
    testsuiteBrowser: Maybe<Browsers>;

    /**
     * Will return the browser to use with Sakuli based on configuration. It will return value of
     * - [`browser`]{@link LegacyProjectProperties.browser} property if set
     * - otherwise [`testsuite.browser`]{@link LegacyProjectProperties.testsuiteBrowser} if set
     * - other `"firefox"`
     * @returns Browsers - a valid browser string that can be used by selenium
     */
    getBrowser(): Browsers {
        return this.browser || this.testsuiteBrowser || 'firefox'
    }

    @BooleanProperty('ui-only')
    @BooleanProperty('testsuite.uiOnly')
    uiOnly: boolean = false;

    /**
     */
    @NumberProperty('sakuli.environment.similarity.default')
    sakuliEnvironmentSimilarityDefault: number = 0.99;

    /**
     * DEFAULT: false
     */
    @BooleanProperty('sakuli.autoHighlight')
    sakuliAutoHighlight: boolean = false;

    /**
     * Auto highlight duration (float)
     */
    @NumberProperty('sakuli.highlight.seconds')
    sakuliHighlightSeconds: number = 0.2;

    /**
     * Type delay - specifies the amount of time in ms to wait between keypresses
     */
    @NumberProperty('sakuli.typeDelay')
    typeDelay: number = 300;

    /**
     * Sakuli click delay when clicking mouse buttons in ms
     */
    @NumberProperty('sakuli.clickDelay')
    sikuliClickDelay: number = 0.2;

    /**
     * Overwrite this property or us the environment var `SAKULI_ENCRYPTION_KEY` as master key for en- and decryption
     */
    @StringProperty('sakuli.encryption.key')
    sakuliEncryptionKey: string = "";

    /**
     * Enable / disable screenshots on error
     */
    @BooleanProperty('sakuli.screenshot.onError')
    errorScreenshot: boolean = true;

    /**
     * folder for screenshot files (if activated)
     */
    @StringProperty('sakuli.screenshot.dir')
    screenshotDir: string = "${sakuli.log.folder}/_screenshots";

}
