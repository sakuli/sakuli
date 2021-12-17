import { EOL } from "os";

export interface ConfigValue {
  isComment: boolean;
  value: string;
}

export const commentValue = (value: string = "") => ({
  isComment: true,
  value,
});
export const configValue = (value: string = "") => ({
  isComment: false,
  value,
});

export type ConfigurationRecord = Record<string, ConfigValue>;

export const recordToPropertiesString = (record: ConfigurationRecord) =>
  Object.entries(record)
    .map(
      ([key, { isComment, value }]) => `${isComment ? "#" : ""}${key}=${value}`
    )
    .join(EOL) + EOL;
