import {Key} from "./key.class";
import {CommandLineResult} from "./commandline-result.class";
import {clipboard, Key as NutKey, keyboard, mouse, screen} from "@nut-tree/nut-js";
import {parse} from "path";
import {FileType} from "@nut-tree/nut-js/dist/lib/file-type.enum";
import {cwd} from "process";
import {decryptSecret, withEncryption} from "./secrets.function";

export class Environment {
    private static DEFAULT_SIMILARITY = 0.8;
    private currentSimilarity = Environment.DEFAULT_SIMILARITY;

    constructor() {
    }

    public getSimilarity(): number {
        return this.currentSimilarity;
    }

    public setSimilarity(similarity: number) {
        if (similarity > 0 && similarity <= 1) {
            this.currentSimilarity = similarity;
        }
    }

    public resetSimilarity() {
        this.currentSimilarity = Environment.DEFAULT_SIMILARITY;
    }

    public async takeScreenshot(filename: string): Promise<string> {
        const pathParts = parse(filename);
        const outputDir = (pathParts.dir && pathParts.dir.length > 0) ? pathParts.dir : cwd();
        return screen.capture(pathParts.name, FileType.PNG, outputDir);
    }

    public async takeScreenshotWithTimestamp(filename: string): Promise<string> {
        const pathParts = parse(filename);
        const outputDir = (pathParts.dir && pathParts.dir.length > 0) ? pathParts.dir : cwd();
        return screen.capture(pathParts.name, FileType.PNG, outputDir, "", `_${Date.now()}`);
    }

    public async sleep(s: number): Promise<Environment> {
        await new Promise<void>(resolve => setTimeout(resolve, s * 1000));
        return this;
    }

    public async sleepMs(ms: number): Promise<Environment> {
        await new Promise<void>(resolve => setTimeout(resolve, ms));
        return this;
    }

    public async getRegionFromFocusedWindow() {
        // TODO
    }

    public async getClipboard(): Promise<string> {
        return clipboard.paste();
    }

    public async setClipboard(text: string): Promise<Environment> {
        await clipboard.copy(text);
        return this;
    }

    public async pasteClipboard(): Promise<Environment> {
        await keyboard.type(...this.pasteShortcut());
        return this;
    }

    public async copyIntoClipboard(): Promise<Environment> {
        await keyboard.type(...this.copyShortcut());
        return this;
    }

    public async cleanClipboard(): Promise<void> {
        // TODO
    }

    public async paste(text: string): Promise<Environment> {
        await clipboard.copy(text);
        await keyboard.type(...this.pasteShortcut());
        return this;
    }

    public async pasteMasked(text: string): Promise<Environment> {
        // TODO Do not log text, once we log anything at all
        return this.paste(text);
    }

    public async pasteAndDecrypt(text: string): Promise<Environment> {
        return withEncryption(text, async (decrypted) => {
            return this.paste(decrypted);
        });
    }

    public async type(text: string, ...optModifiers: Key[]): Promise<Environment> {
        await keyboard.pressKey(...optModifiers as NutKey[]);
        await keyboard.type(text);
        await keyboard.releaseKey(...optModifiers as NutKey[]);
        return this;
    }

    public async typeMasked(text: string, ...optModifiers: Key[]): Promise<Environment> {
        // TODO Do not log text, once we log anything at all
        return this.type(text, ...optModifiers);
    }

    public async typeAndDecrypt(text: string, ...optModifiers: Key[]): Promise<Environment> {
        return withEncryption(text, async (decrypted) => {
            return this.type(decrypted, ...optModifiers);
        });
    }

    public decryptSecret(secret: string): Promise<string> {
        return decryptSecret(secret);
    }

    public async keyDown(...keys: Key[]): Promise<Environment> {
        await keyboard.pressKey(...keys as NutKey[]);
        return this;
    }

    public async keyUp(...keys: Key[]): Promise<Environment> {
        await keyboard.releaseKey(...keys as NutKey[]);
        return this;
    }

    public async write(text: string): Promise<Environment> {
        await keyboard.type(text);
        return this;
    }

    public async mouseWheelDown(steps: number): Promise<Environment> {
        await mouse.scrollDown(steps);
        return this;
    }

    public async mouseWheelUp(steps: number): Promise<Environment> {
        await mouse.scrollUp(steps);
        return this;
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
        return process.env[key];
    }

    public getProperty(key: string): string | undefined {
        // TODO
        return;
    }

    private copyShortcut(): NutKey[] {
        return (process.platform === "darwin") ? [NutKey.LeftSuper, NutKey.C] : [NutKey.LeftControl, NutKey.C];
    }

    private cutShortcut(): NutKey[] {
        return (process.platform === "darwin") ? [NutKey.LeftSuper, NutKey.X] : [NutKey.LeftControl, NutKey.X];
    }

    private pasteShortcut(): NutKey[] {
        return (process.platform === "darwin") ? [NutKey.LeftSuper, NutKey.V] : [NutKey.LeftControl, NutKey.V];
    }
}