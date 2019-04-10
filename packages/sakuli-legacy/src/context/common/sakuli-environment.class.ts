import {Key} from "./key.class";
import {CommandLineResult} from "./commandline-result.class";
import {decryptSecret} from "./secrets.function";
import {ClipboardApi} from "./actions/clipboard.function";
import {KeyboardApi} from "./actions/keyboard.function";
import {Project, TestExecutionContext} from "@sakuli/core";
import {ScreenApi} from "./actions/screen.function";
import {MouseApi} from "./actions/mouse.function";

import nutConfig from "./nut-global-config.class";
import {execute} from "./actions/command.function";
import {Environment} from "./environment.interface";
import {Region} from "./region.interface";
import {createRegionClass} from "./sakuli-region.class";

export function createEnvironmentClass(ctx: TestExecutionContext, project: Project) {
    return class SakuliEnvironment implements Environment {
        constructor() {
        }

        public getSimilarity(): number {
            return nutConfig.confidence;
        }

        public setSimilarity(similarity: number) {
            if (similarity > 0 && similarity <= 1) {
                ctx.logger.info(`New similarity value: ${similarity}`);
                nutConfig.confidence = similarity;
            } else {
                ctx.logger.warn(`Invalid value for similarity: ${similarity}. Skipping update`);
            }
        }

        public resetSimilarity() {
            ctx.logger.info(`Resetting similarity to default value`);
            nutConfig.resetConfidence();
        }

        public async takeScreenshot(filename: string): Promise<string> {
            ctx.logger.info(`Taking screenshot with filename '${filename}'`);
            return ScreenApi.takeScreenshot(filename);
        }

        public async takeScreenshotWithTimestamp(filename: string): Promise<string> {
            ctx.logger.info(`Taking screenshot with filename '${filename}' and timestamp`);
            return ScreenApi.takeScreenshotWithTimestamp(filename);
        }

        public async sleep(seconds: number): Promise<Environment> {
            ctx.logger.info(`Sleeping for ${seconds} seconds`);
            return new Promise<Environment>(resolve => setTimeout(() => resolve(this), seconds * 1000));
        }

        public async sleepMs(milliseconds: number): Promise<Environment> {
            ctx.logger.info(`Sleeping for ${milliseconds} milliseconds`);
            return new Promise<Environment>(resolve => setTimeout(() => resolve(this), milliseconds));
        }

        public async getRegionFromFocusedWindow(): Promise<Region> {
            ctx.logger.warn(`Unable to determine region of focused window, falling back to screen`);
            const RegionImpl = createRegionClass(ctx);
            return new RegionImpl(0, 0, await ScreenApi.width(), await ScreenApi.height());
        }

        public async getClipboard(): Promise<string> {
            const content = ClipboardApi.getClipboard();
            ctx.logger.info(`Clipboard content: '${content}'`);
            return content;
        }

        public async setClipboard(text: string): Promise<Environment> {
            ctx.logger.info(`Setting clipboard content: '${text}'`);
            await ClipboardApi.setClipboard(text);
            return this;
        }

        public async pasteClipboard(): Promise<Environment> {
            ctx.logger.info(`Pasting native clipboard content`);
            await ClipboardApi.pasteClipboard();
            return this;
        }

        public async copyIntoClipboard(): Promise<Environment> {
            ctx.logger.info(`Copying to native clipboard`);
            await ClipboardApi.copyIntoClipboard();
            return this;
        }

        public async cleanClipboard(): Promise<void> {
            throw new Error("Not Implemented");
        }

        public async paste(text: string): Promise<Environment> {
            ctx.logger.info(`Pasting '${text}' via native clipboard`);
            await KeyboardApi.paste(text);
            return this;
        }

        public async pasteMasked(text: string): Promise<Environment> {
            ctx.logger.info(`Pasting '****' via native clipboard`);
            await KeyboardApi.paste(text);
            return this;
        }

        public async pasteAndDecrypt(text: string): Promise<Environment> {
            ctx.logger.info(`Pasting encrypted text '${text}' via native clipboard`);
            await KeyboardApi.pasteAndDecrypt(text);
            return this;
        }

        public async type(text: string, ...optModifiers: Key[]): Promise<Environment> {
            ctx.logger.info(`Typing text '${text}' via keyboard`);
            await KeyboardApi.type(text, ...optModifiers);
            return this;
        }

        public async typeMasked(text: string, ...optModifiers: Key[]): Promise<Environment> {
            ctx.logger.info(`Typing text '****' via keyboard`);
            await KeyboardApi.type(text, ...optModifiers);
            return this;
        }

        public async typeAndDecrypt(text: string, ...optModifiers: Key[]): Promise<Environment> {
            ctx.logger.info(`Typing encrypted text ${text}`);
            await KeyboardApi.typeAndDecrypt(text, ...optModifiers);
            return this;
        }

        public decryptSecret(secret: string): Promise<string> {
            ctx.logger.info(`Decrypting secret '${secret}'`);
            return decryptSecret(secret);
        }

        public async keyDown(...keys: Key[]): Promise<Environment> {
            ctx.logger.info(`Pressing keys: ${keys}`);
            await KeyboardApi.pressKey(...keys);
            return this;
        }

        public async keyUp(...keys: Key[]): Promise<Environment> {
            ctx.logger.info(`Releasing keys: ${keys}`);
            await KeyboardApi.releaseKey(...keys);
            return this;
        }

        public async write(text: string): Promise<Environment> {
            ctx.logger.info(`Writing: ${text} via keyboard`);
            await KeyboardApi.type(text);
            return this;
        }

        public async mouseWheelDown(steps: number): Promise<Environment> {
            ctx.logger.info(`Scrolling down ${steps} px`);
            await MouseApi.scrollDown(steps);
            return this;
        }

        public async mouseWheelUp(steps: number): Promise<Environment> {
            ctx.logger.info(`Scrolling up ${steps} px`);
            await MouseApi.scrollUp(steps);
            return this;
        }

        public isWindows(): boolean {
            ctx.logger.info(`Is Windows? '${process.platform === 'win32'}`);
            return process.platform === "win32";
        }

        public isLinux(): boolean {
            ctx.logger.info(`Is Linux? '${process.platform === 'linux'}`);
            return process.platform === "linux";
        }

        public isDarwin(): boolean {
            ctx.logger.info(`Is Darwin? '${process.platform === 'darwin'}`);
            return process.platform === "darwin";
        }

        public getOsIdentifier(): string {
            ctx.logger.info(`Fetching OS identifier: ${process.platform}`);
            return process.platform;
        }

        public runCommand(command: string, optThrowException: boolean = false): Promise<CommandLineResult> {
            ctx.logger.info(`Executing command '${command}`);
            return new Promise<CommandLineResult>(async (resolve, reject) => {
                try {
                    const result = await execute(command);
                    ctx.logger.info(`Return code: ${result.getExitCode()}, Output: ${result.getOutput()}`);
                    if (result.getExitCode() !== 0 && optThrowException) {
                        reject(`Command execution failed with exit code '${result.getExitCode()}`);
                    } else {
                        resolve(result);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }

        public getEnv(key: string): string | null {
            const result = process.env[key];
            ctx.logger.info(`Accessing environment variable '${key}': ${result}`);
            return process.env[key] || null;
        }

        public getProperty(key: string): string | null{
            ctx.logger.info(`Accessing property ${key}: ${project.get(key)}`);
            return project.get(key);
        }
    }
}

