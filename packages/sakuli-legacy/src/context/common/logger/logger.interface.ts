export interface Logger {
  logError(message: string): void;
  logWarning(message: string): void;
  logInfo(message: string): void;
  logDebug(message: string): void;
}
