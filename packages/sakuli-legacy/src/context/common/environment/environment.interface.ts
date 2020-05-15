import { Key } from "../key.class";
import { CommandLineResult } from "./commandline-result.class";
import { Region } from "../region";

export interface Environment {
  getSimilarity(): number;
  setSimilarity(similarity: number): void;
  resetSimilarity(): void;
  takeScreenshot(filename: string): Promise<string>;
  takeScreenshotWithTimestamp(filename: string): Promise<string>;
  sleep(s: number): Promise<Environment>;
  sleepMs(ms: number): Promise<Environment>;
  getRegionFromFocusedWindow(): Promise<Region>;
  getClipboard(): Promise<string>;
  getClipboardMasked(): Promise<string>;
  setClipboard(text: string): Promise<Environment>;
  setClipboardMasked(text: string): Promise<Environment>;
  pasteClipboard(): Promise<Environment>;
  copyIntoClipboard(): Promise<Environment>;
  cleanClipboard(): Promise<void>;
  paste(text: string): Promise<Environment>;
  pasteMasked(text: string): Promise<Environment>;
  pasteAndDecrypt(text: string): Promise<Environment>;
  type(text: string, ...optModifiers: Key[]): Promise<Environment>;
  typeMasked(text: string, ...optModifiers: Key[]): Promise<Environment>;
  typeAndDecrypt(text: string, ...optModifiers: Key[]): Promise<Environment>;
  decryptSecret(secret: string): Promise<string>;
  keyDown(...keys: Key[]): Promise<Environment>;
  keyUp(...keys: Key[]): Promise<Environment>;
  write(text: string): Promise<Environment>;
  mouseWheelDown(steps: number): Promise<Environment>;
  mouseWheelUp(steps: number): Promise<Environment>;
  isWindows(): boolean;
  isLinux(): boolean;
  isDarwin(): boolean;
  getOsIdentifier(): string;
  runCommand(
    command: string,
    optThrowException: boolean
  ): Promise<CommandLineResult>;
  getEnv(key: string): string | null;
  getEnvMasked(key: string): string | null;
  getProperty(key: string): string | null;
  getPropertyMasked(key: string): string | null;
}
