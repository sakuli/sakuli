import { StringProperty } from "@sakuli/commons";

export class SakuliCoreProperties {
  /**
   * For usage see SimpleLogger
   */
  @StringProperty("log.level")
  logLevel: string = "INFO";

  /**
   * Defines where the log output is written to
   */
  @StringProperty("log.mode")
  logMode: string = "";

  /**
   * Deletes all files that are older than the defined days in the folder `sakuli.log.folder`
   *
   * DEFAULT: 14 days
   */
  @StringProperty("sakuli.log.maxAge")
  sakuliLogMaxAge: number = 14;

  /**
   * log file folder
   */
  @StringProperty("sakuli.log.folder")
  sakuliLogFolder: string = "${sakuli.testsuite.folder}/_logs";
}
