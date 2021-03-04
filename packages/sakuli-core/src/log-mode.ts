export enum LogMode {
  LOG_FILE = "logFile",
  CI = "ci",
}

export function parseLogMode(logModeString?: string | null) {
  if (logModeString) {
    for (let logMode of Object.values(LogMode)) {
      if (logMode === logModeString) {
        return logMode as LogMode;
      }
    }
  }
  return undefined;
}
