import { promises as fs } from "fs";
import { join } from "path";
import { ConfigurationRecord, recordToPropertiesString, } from "./configuration-record.type";

/**
 * Creates a task that will convert the configurationRecords (key - value pairs)
 * into proper property-file format string and writes it into sakuli.properties
 *
 * We assume that the configuration for all enterprise features can be bootstrapped
 * in the sakuli.properties which means they apply for all testsuites
 *
 * @param configurationRecord - key - value pairs which are written to properties file
 * @param path - the path to `sakuli.properties`
 */
export const configureFeatureTask = (
  configurationRecord: ConfigurationRecord,
  path: string = process.cwd()
) => async () => {
  await fs.writeFile(
    join(path, "sakuli.properties"),
    recordToPropertiesString(configurationRecord),
    { flag: "a" }
  );
};
