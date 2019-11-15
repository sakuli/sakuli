import { promises as fs } from "fs";
import { join } from "path";

export const recordToPropertiesString = (record: Record<string, string>) => Object
    .entries(record)
    .map(([key, value]) => `${key=value}`)
    .join('\n')

export const configureFeatureTask = (configurationItems: Record<string, string>) => async () => {
    await fs.writeFile(
        join(process.cwd(), 'sakuli.properties'),
        recordToPropertiesString(configurationItems),
        { flag: 'a' }
    );
}
