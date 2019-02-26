import {Key} from "./key.class";
import {CommandLineResult} from "./commandline-result.class";

export class Environment {
    private static DEFAULT_SIMILARITY = 0.8;
    private currentSimilarity = Environment.DEFAULT_SIMILARITY;

    constructor() {
    }

    getSimilarity(): number {
        return this.currentSimilarity;
    }

    setSimilarity(similarity: number) {
        if (similarity > 0 && similarity <= 1) {
            this.currentSimilarity = similarity;
        }
    }

    resetSimilarity() {
        this.currentSimilarity = Environment.DEFAULT_SIMILARITY;
    }

    async takeScreenshot(filename: string): Promise<string | null> {
        return new Promise<null>(resolve => resolve);
    }

    async takeScreenshotWithTimestamp(filename: string): Promise<string | null> {
        return new Promise<null>(resolve => resolve);
    }

    async sleep(s: number): Promise<void> {
        return new Promise<void>(resolve => setTimeout(resolve, s * 1000));
    }

    async sleepMs(ms: number): Promise<void> {
        return new Promise<void>(resolve => setTimeout(resolve, ms));
    }

    public getRegionFromFocusedWindow() {
    }

    public getClipboard(): Promise<string | null> {
        return new Promise<null>(resolve => resolve);
    }

    public setClipboard(text: string): void {
    }

    public pasteClipboard(): void {
    }

    public copyIntoClipboard(): void {
    }

    public cleanClipboard(): void {
    }

    public paste(text: string): void {
    }

    public pasteMasked(text: string): void {
    }

    public pasteAndDecrypt(text: string): void {
    }

    public type(text: string, ...optModifiers: Key[]): void {
    }

    public typeMasked(text: string, ...optModifiers: Key[]): void {
    }

    public typeAndDecrypt(text: string, ...optModifiers: Key[]): void {
    }

    public decryptSecret(secret: string): void {
    }

    public keyDown(keys: any): void {
    }

    public keyUp(keys: any): void {
    }

    public write(text: any): void {
    }

    public mouseWheelDown(steps: number): void {
    }

    public mouseWheelUp(steps: number): void {
    }

    public isWindows(): boolean {
        return process.platform === "win32";
    }

    public isLinux(): boolean {
        return process.platform === "linux";
    }

    public isDarwin(): boolean {
        return process.platform === "darwin";
    }

    public getOsIdentifier(): string {
        return process.platform;
    }

    public runCommand(command: string, optThrowException: boolean = false): Promise<CommandLineResult> {
        return new Promise<CommandLineResult>(resolve => resolve);
    }

    public getEnv(key: string): string | undefined {
        return process.env[key.toLocaleUpperCase()];
    }

    public getProperty(key: string): string | undefined {
        return;
    }
}