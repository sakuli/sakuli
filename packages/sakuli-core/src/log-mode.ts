export enum LogMode {
  LOG_FILE = "logfile",
  CI = "ci",
}

export function parseLogMode(str: string) {
  for (let logMode of Object.values(LogMode)) {
    if (logMode === str) {
      return logMode as LogMode;
    }
  }
  return undefined;
}
