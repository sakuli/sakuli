import {Key} from "./key.class";
import {CommandLineResult} from "./commandline-result.class";
import {decryptSecret} from "./secrets.function";
import {ClipboardApi} from "./actions/clipboard.functions";
import {KeyboardApi} from "./actions/keyboard.functions";
import {TestExecutionContext} from "@sakuli/core";
import {ScreenApi} from "./actions/screen.functions";
import {MouseApi} from "./actions/mouse.functions";

export function createEnvironmentClass(ctx: TestExecutionContext) {
    return class LoggingEnvironment extends Environment {
        constructor() {
            super();
        }

        public getSimilarity(): number {
            return super.getSimilarity();
        }

        public setSimilarity(similarity: number) {
            super.setSimilarity(similarity);
        }

        public resetSimilarity() {
            super.resetSimilarity();
        }

        public async takeScreenshot(filename: string): Promise<string> {
            ctx.logger.info(`Taking screenshot with filename '${filename}'`);
            return super.takeScreenshot(filename);
        }

        public async takeScreenshotWithTimestamp(filename: string): Promise<string> {
            ctx.logger.info(`Taking screenshot with filename '${filename}' and timestamp`);
            return super.takeScreenshotWithTimestamp(filename);
        }

        public async sleep(seconds: number): Promise<LoggingEnvironment> {
            ctx.logger.info(`Sleeping for ${seconds} seconds`);
            return new Promise<LoggingEnvironment>(resolve => setTimeout(() => resolve(this), seconds * 1000));
        }

        public async sleepMs(milliseconds: number): Promise<LoggingEnvironment> {
            ctx.logger.info(`Sleeping for ${milliseconds} milliseconds`);
            return new Promise<LoggingEnvironment>(resolve => setTimeout(() => resolve(this), milliseconds));
        }

        public async getRegionFromFocusedWindow() {
            // TODO
        }

        public async getClipboard(): Promise<string> {
            const content = super.getClipboard();
            ctx.logger.info(`Clipboard content: '${content}'`);
            return content;
        }

        public async setClipboard(text: string): Promise<LoggingEnvironment> {
            ctx.logger.info(`Setting clipboard content: '${text}'`);
            return super.setClipboard(text);
        }

        public async pasteClipboard(): Promise<LoggingEnvironment> {
            ctx.logger.info(`Pasting native clipboard content`);
            return super.pasteClipboard();
        }

        public async copyIntoClipboard(): Promise<LoggingEnvironment> {
            ctx.logger.info(`Copying to native clipboard`);
            return super.copyIntoClipboard();
        }

        public async cleanClipboard(): Promise<void> {
            // TODO
        }

        public async paste(text: string): Promise<LoggingEnvironment> {
            ctx.logger.info(`Pasting '${text}' via native clipboard`);
            return super.paste(text);
        }

        public async pasteMasked(text: string): Promise<LoggingEnvironment> {
            ctx.logger.info(`Pasting '****' via native clipboard`);
            return this.paste(text);
        }

        public async pasteAndDecrypt(text: string): Promise<LoggingEnvironment> {
            ctx.logger.info(`Pasting encrypted text '${text}' via native clipboard`);
            return super.pasteAndDecrypt(text);
        }

        public async type(text: string, ...optModifiers: Key[]): Promise<LoggingEnvironment> {
            ctx.logger.info(`Typing text '${text}' via keyboard`);
            return super.type(text, ...optModifiers);
        }

        public async typeMasked(text: string, ...optModifiers: Key[]): Promise<LoggingEnvironment> {
            ctx.logger.info(`Typing text '****' via keyboard`);
            return super.type(text, ...optModifiers);
        }

        public async typeAndDecrypt(text: string, ...optModifiers: Key[]): Promise<LoggingEnvironment> {
            ctx.logger.info(`Typing encrypted text ${text}`);
            return super.typeAndDecrypt(text, ...optModifiers);
        }

        public decryptSecret(secret: string): Promise<string> {
            ctx.logger.info(`Decrypting secret '${secret}'`);
            return super.decryptSecret(secret);
        }

        public async keyDown(...keys: Key[]): Promise<LoggingEnvironment> {
            return super.keyDown(...keys);
        }

        public async keyUp(...keys: Key[]): Promise<LoggingEnvironment> {
            return super.keyUp(...keys);
        }

        public async write(text: string): Promise<LoggingEnvironment> {
            ctx.logger.info(`Writing: ${text} via keyboard`);
            return super.write(text);
        }

        public async mouseWheelDown(steps: number): Promise<LoggingEnvironment> {
            ctx.logger.info(`Scrolling down ${steps} px`);
            return super.mouseWheelDown(steps);
        }

        public async mouseWheelUp(steps: number): Promise<LoggingEnvironment> {
            ctx.logger.info(`Scrolling up ${steps} px`);
            return super.mouseWheelUp(steps);
        }

        public isWindows(): boolean {
            ctx.logger.info(`Is Windows?`);
            return super.isWindows();
        }

        public isLinux(): boolean {
            ctx.logger.info(`Is Linux?`);
            return super.isLinux();
        }

        public isDarwin(): boolean {
            ctx.logger.info(`Is Darwin?`);
            return super.isDarwin();
        }

        public getOsIdentifier(): string {
            ctx.logger.info(`Fetching OS identifier`);
            return super.getOsIdentifier();
        }

        public runCommand(command: string, optThrowException: boolean = false): Promise<CommandLineResult> {
            return new Promise<CommandLineResult>(resolve => resolve);
        }

        public getEnv(key: string): string | undefined {
            ctx.logger.info(`Accessing environment variable '${key}'`);
            return super.getEnv(key);
        }

        public getProperty(key: string): string | undefined {
            // TODO
            return;
        }
    }
}

export class Environment {
    static DEFAULT_SIMILARITY = 0.99;
    currentSimilarity = Environment.DEFAULT_SIMILARITY;

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
        return ScreenApi.takeScreenshot(filename);
    }

    public async takeScreenshotWithTimestamp(filename: string): Promise<string> {
        return ScreenApi.takeScreenshotWithTimestamp(filename);
    }

    public async sleep(s: number): Promise<Environment> {
        return new Promise<Environment>(resolve => setTimeout(() => resolve(this), s * 1000));
    }

    public async sleepMs(ms: number): Promise<Environment> {
        return new Promise<Environment>(resolve => setTimeout(() => resolve(this), ms));
    }

    public async getRegionFromFocusedWindow() {
        // TODO
    }

    public async getClipboard(): Promise<string> {
        return ClipboardApi.getClipboard();
    }

    public async setClipboard(text: string): Promise<Environment> {
        await ClipboardApi.setClipboard(text);
        return this;
    }

    public async pasteClipboard(): Promise<Environment> {
        await ClipboardApi.pasteClipboard();
        return this;
    }

    public async copyIntoClipboard(): Promise<Environment> {
        await ClipboardApi.copyIntoClipboard();
        return this;
    }

    public async cleanClipboard(): Promise<void> {
        // TODO
    }

    public async paste(text: string): Promise<Environment> {
        await KeyboardApi.paste(text);
        return this;
    }

    public async pasteMasked(text: string): Promise<Environment> {
        return this.paste(text);
    }

    public async pasteAndDecrypt(text: string): Promise<Environment> {
        await KeyboardApi.pasteAndDecrypt(text);
        return this;
    }

    public async type(text: string, ...optModifiers: Key[]): Promise<Environment> {
        await KeyboardApi.type(text, ...optModifiers);
        return this;
    }

    public async typeMasked(text: string, ...optModifiers: Key[]): Promise<Environment> {
        return this.type(text, ...optModifiers);
    }

    public async typeAndDecrypt(text: string, ...optModifiers: Key[]): Promise<Environment> {
        await KeyboardApi.typeAndDecrypt(text, ...optModifiers);
        return this;
    }

    public decryptSecret(secret: string): Promise<string> {
        return decryptSecret(secret);
    }

    public async keyDown(...keys: Key[]): Promise<Environment> {
        await KeyboardApi.pressKey(...keys);
        return this;
    }

    public async keyUp(...keys: Key[]): Promise<Environment> {
        await KeyboardApi.releaseKey(...keys);
        return this;
    }

    public async write(text: string): Promise<Environment> {
        await KeyboardApi.type(text);
        return this;
    }

    public async mouseWheelDown(steps: number): Promise<Environment> {
        await MouseApi.scrollDown(steps);
        return this;
    }

    public async mouseWheelUp(steps: number): Promise<Environment> {
        await MouseApi.scrollUp(steps);
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
}