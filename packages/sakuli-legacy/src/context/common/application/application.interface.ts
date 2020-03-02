import {Region} from "../region";

/**
 * Application interface
 *
 * Interface to open and close applications
 * @param name: Application name, might be a single execute or a whole path. *Note*: if the application path and / or name has whitespaces in it one needs to escape them properly. See example below.
 *
 * @example
 * Creating an Application instance
 *
 * ```typescript
 * const calc = new Application("gnome-calculator");
 * ```
 *
 * Pass arguments to application
 *
 * ```typescript
 * const example = new Application("/path/to/my/application --param1 --param2 param3");
 * ```
 *
 * Pass arguments to application containing whitespaces
 *
 * ```typescript
 * const example = new Application("/path\\ with\\ whitespaces/application\\ name --param1 --param2 param3");
 * ```
 */
export interface Application {
    /**
     * Opens the application
     */
    open(): Promise<Application>;

    /**
     * Not yet implemented
     */
    focus(): Promise<Application>;

    /**
     * Not yet implemented
     */
    focusWindow(windowNumber: number): Promise<Application>;

    /**
     * Closes the application
     */
    close(optSilent?: boolean): Promise<Application>;

    /**
     * Force closes the application
     */
    kill(optSilent?: boolean): Promise<Application>;

    /**
     * Configures an initial startup delay in seconds. Used to wait for applications which might require some time to start.
     */
    setSleepTime(seconds: number): Application;

    /**
     * Not yet implemented
     */
    getRegion(): Promise<Region>;

    /**
     * Not yet implemented
     */
    getRegionForWindow(windowNumber: number): Promise<Region>;

    /**
     * Returns the application name passed to the constructor
     */
    getName(): string;
}
