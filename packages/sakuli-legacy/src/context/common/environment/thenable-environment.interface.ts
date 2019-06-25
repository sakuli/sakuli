import {Environment} from "./environment.interface";
import {Key} from "../key.class";
import {CommandLineResult} from "./commandline-result.class";
import {ThenableRegion} from "../region";

export interface ThenableEnvironment extends PromiseLike<Environment> {
    readonly env: Promise<Environment>;

    cleanClipboard(): Promise<void>;

    copyIntoClipboard(): ThenableEnvironment;

    decryptSecret(secret: string): Promise<string>;

    getClipboard(): Promise<string>;

    getEnv(key: string): Promise<string | null>;

    getOsIdentifier(): Promise<string>;

    getProperty(key: string): Promise<string | null>;

    getRegionFromFocusedWindow(): ThenableRegion;

    getSimilarity(): Promise<number>;

    isDarwin(): Promise<boolean>;

    isLinux(): Promise<boolean>;

    isWindows(): Promise<boolean>;

    keyDown(...keys: Key[]): ThenableEnvironment;

    keyUp(...keys: Key[]): ThenableEnvironment;

    mouseWheelDown(steps: number): ThenableEnvironment;

    mouseWheelUp(steps: number): ThenableEnvironment;

    paste(text: string): ThenableEnvironment;

    pasteAndDecrypt(text: string): ThenableEnvironment;

    pasteClipboard(): ThenableEnvironment;

    pasteMasked(text: string): ThenableEnvironment;

    resetSimilarity(): Promise<void>;

    runCommand(command: string, optThrowException: boolean): Promise<CommandLineResult>;

    setClipboard(text: string): ThenableEnvironment;

    setSimilarity(similarity: number): Promise<void>;

    sleep(s: number): ThenableEnvironment;

    sleepMs(ms: number): ThenableEnvironment;

    takeScreenshot(filename: string): Promise<string>;

    takeScreenshotWithTimestamp(filename: string): Promise<string>;

    type(text: string, ...optModifiers: Key[]): ThenableEnvironment;

    typeAndDecrypt(text: string, ...optModifiers: Key[]): ThenableEnvironment;

    typeMasked(text: string, ...optModifiers: Key[]): ThenableEnvironment;

    write(text: string): ThenableEnvironment;
}