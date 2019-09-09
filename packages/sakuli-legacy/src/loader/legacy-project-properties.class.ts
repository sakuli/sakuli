import {Property, BooleanProperty} from "@sakuli/commons";
import {Browsers} from "../context/selenium-config/create-driver-from-project.function";

export class LegacyProjectProperties {
    /**
     *
     */
    @Property('testsuite.id')
    testsuiteId: string = "";

    /**
     * Descriptive name for the current test suite
     * DEFAULT: value of 'testsuite.id'
     */
    @Property('testsuite.name')
    testsuiteName: string = "";

    /**
     * The warning runtime threshold (seconds) estimates the execution time of the complete
     * test suite. If the warning time is exceeded, the test suite will get the state
     * 'WARNING'.
     * If the threshold is set to 0, the execution time will never exceed, so the state will be always OK!
     * DEFAULT:0
     */
    @Property('testsuite.warningTime')
    testsuiteWarningTime: number = 0;

    /**
     * The critical runtime threshold (seconds) estimates the execution time of the complete
     * test suite. If the critical time is exceeded, the test suite will get the state
     * 'CRITICAL'.
     * If the threshold is set to 0, the execution time will never exceed, so the state will be always OK!
     * DEFAULT:0
     */
    @Property('testsuite.criticalTime')
    testsuiteCriticalTime: number = 0;

    /**
     * Defines the browser in witch the test suite should be executed
     * values are corresponding to the file
     * /userdata/config/browser_types.
     *
     * DEFAULT: firefox
     */
    @Property('browser')
    @Property('testsuite.browser')
    testsuiteBrowser: Browsers = "firefox";

    @BooleanProperty('ui-only')
    @BooleanProperty('testsuite.uiOnly')
    uiOnly: boolean = false;

    /**
     */
    @Property('sakuli.environment.similarity.default')
    sakuliEnvironmentSimilarityDefault: number = 0.99;

    /**
     * DEFAULT: false
     */
    @Property('sakuli.autoHighlight')
    sakuliAutoHighlight: boolean = false;

    /**
     * Auto highlight duration (float)
     */
    @Property('sakuli.highlight.seconds')
    sakuliHighlightSeconds: number = 0.2;

    /**
     * Type delay - specifies the amount of time in ms to wait between keypresses
     */
    @Property('sakuli.typeDelay')
    typeDelay: number = 300;

    /**
     * Sakuli click delay when clicking mouse buttons in ms
     */
    @Property('sakuli.clickDelay')
    sikuliClickDelay: number = 0.2;

    /**
     * Overwrite this property or us the environment var `SAKULI_ENCRYPTION_KEY` as master key for en- and decryption
     */
    @Property('sakuli.encryption.key')
    sakuliEncryptionKey: string = "";

    /**
     * Enable / disable screenshots on error
     */
    @BooleanProperty('sakuli.screenshot.onError')
    errorScreenshot: boolean = true;

    /**
     * folder for screenshot files (if activated)
     */
    @Property('sakuli.screenshot.dir')
    screenshotDir: string = "${sakuli.log.folder}/_screenshots";

}
