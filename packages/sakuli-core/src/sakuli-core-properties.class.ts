import { StringProperty, BooleanProperty, Maybe } from "@sakuli/commons";

export class SakuliCoreProperties {
    /**
     * For @see SimpleLogger
     */
    @StringProperty('log.level')
    logLevel: string = "INFO";

    /**
     * Deletes all files that are older than the defined days in the folder `sakuli.log.folder`
     *
     * DEFAULT: 14 days
     */
    @StringProperty('sakuli.log.maxAge')
    sakuliLogMaxAge: number = 14;

    /**
     * log file folder
     */
    @StringProperty('sakuli.log.folder')
    sakuliLogFolder: string = "${sakuli.testsuite.folder}/_logs";

}
