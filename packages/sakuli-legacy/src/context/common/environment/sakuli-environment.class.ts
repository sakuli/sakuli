import { Key } from "../key.class";
import { CommandLineResult } from "./commandline-result.class";
import { decrypt, getEncryptionKey } from "../secrets.function";
import { Project, TestExecutionContext } from "@sakuli/core";
import { ClipboardApi, createKeyboardApi, createMouseApi, execute, runAsAction, ScreenApi } from "../actions";

import nutConfig from "../nut-global-config.class";
import { Environment } from "./environment.interface";
import { createRegionClass, Region } from "../region";
import { LegacyProjectProperties } from "../../../loader/legacy-project-properties.class";

export function createEnvironmentClass(ctx: TestExecutionContext, project: Project) {
    const props = project.objectFactory(LegacyProjectProperties);
    const keyboardApi = createKeyboardApi(props);
    const mouseApi = createMouseApi(props);

    return class SakuliEnvironment implements Environment {
        constructor() {
            this.setSimilarity(props.sakuliEnvironmentSimilarityDefault);
        }

        public getSimilarity(): number {
            return nutConfig.confidence;
        }

        public setSimilarity(similarity: number) {
            if (similarity > 0 && similarity <= 1) {
                ctx.logger.debug(`New similarity value: ${similarity}`);
                nutConfig.confidence = similarity;
            } else {
                ctx.logger.warn(`Invalid value for similarity: ${similarity}. Skipping update`);
            }
        }

        public resetSimilarity() {
            ctx.logger.debug(`Resetting similarity to default value ${props.sakuliEnvironmentSimilarityDefault}`);
            nutConfig.confidence = props.sakuliEnvironmentSimilarityDefault;
        }

        public async takeScreenshot(filename: string): Promise<string> {
            return runAsAction(ctx, "takeScreenShot", () => {
                ctx.logger.debug(`Taking screenshot with filename '${filename}'`);
                return ScreenApi.takeScreenshot(filename);
            })();
        }

        public async takeScreenshotWithTimestamp(filename: string): Promise<string> {
            return runAsAction(ctx, "takeScreenShotWithTimestamp", () => {
                ctx.logger.debug(`Taking screenshot with filename '${filename}' and timestamp`);
                return ScreenApi.takeScreenshotWithTimestamp(filename);
            })();
        }

        public async sleep(seconds: number): Promise<Environment> {
            return runAsAction(ctx, "sleep", () => {
                ctx.logger.debug(`Sleeping for ${seconds} seconds`);
                return new Promise<Environment>(resolve => setTimeout(() => resolve(this), seconds * 1000));
            })();
        }

        public async sleepMs(milliseconds: number): Promise<Environment> {
            return runAsAction(ctx, "sleepMs", () => {
                ctx.logger.debug(`Sleeping for ${milliseconds} milliseconds`);
                return new Promise<Environment>(resolve => setTimeout(() => resolve(this), milliseconds));
            })();
        }

        public async getRegionFromFocusedWindow(): Promise<Region> {
            return runAsAction(ctx, "getRegionFromFocusedWindow", async () => {
                ctx.logger.warn(`Unable to determine region of focused window, falling back to screen`);
                const RegionImpl = createRegionClass(ctx, project);
                return new RegionImpl(0, 0, await ScreenApi.width(), await ScreenApi.height());
            })();
        }

        public async getClipboard(): Promise<string> {
            return runAsAction(ctx, "getClipboard", () => {
                ctx.logger.debug(`Accessing clipboard`);
                return ClipboardApi.getClipboard();
            })();
        }

        public async getClipboardMasked(): Promise<string> {
            return runAsAction(ctx, "getClipboardMasked", () => {
                ctx.logger.debug(`Getting clipboard content`);
                return ClipboardApi.getClipboard();
            })();
        }

        public async setClipboard(text: string): Promise<Environment> {
            return runAsAction(ctx, "setClipboard", async () => {
                ctx.logger.debug(`Setting clipboard content`);
                await ClipboardApi.setClipboard(text);
                return this;
            })();
        }

        public async setClipboardMasked(text: string): Promise<Environment> {
            return runAsAction(ctx, "setClipboardMasked", async () => {
                ctx.logger.debug(`Setting clipboard content`);
                await ClipboardApi.setClipboard(text);
                return this;
            })();
        }

        public async pasteClipboard(): Promise<Environment> {
            return runAsAction(ctx, "pasteClipboard", async () => {
                ctx.logger.debug(`Pasting native clipboard content`);
                await ClipboardApi.pasteClipboard();
                return this;
            })();
        }

        public async copyIntoClipboard(): Promise<Environment> {
            return runAsAction(ctx, "copyIntoClipboard", async () => {
                ctx.logger.debug(`Copying to native clipboard`);
                await ClipboardApi.copyIntoClipboard();
                return this;
            })();
        }

        public async cleanClipboard(): Promise<void> {
            return runAsAction(ctx, "cleanClipboard", () => {
                throw new Error("Not Implemented");
            })();
        }

        public async paste(text: string): Promise<Environment> {
            return runAsAction(ctx, "paste", async () => {
                ctx.logger.debug(`Pasting '${text}' via native clipboard`);
                await keyboardApi.paste(text);
                return this;
            })();
        }

        public async pasteMasked(text: string): Promise<Environment> {
            return runAsAction(ctx, "pasteMasked", async () => {
                ctx.logger.debug(`Pasting '****' via native clipboard`);
                await keyboardApi.paste(text);
                return this;
            })();
        }

        public async pasteAndDecrypt(text: string): Promise<Environment> {
            return runAsAction(ctx, "pasteAndDecrypt", async () => {
                ctx.logger.debug(`Pasting encrypted text '${text}' via native clipboard`);
                const key = getEncryptionKey(project);
                await keyboardApi.pasteAndDecrypt(key, text);
                return this;
            })();
        }

        public async type(text: string | Key, ...optModifiers: Key[]): Promise<Environment> {
            return runAsAction(ctx, "type", async () => {
                ctx.logger.debug(`Typing text '${text}' via keyboard`);
                await keyboardApi.type(text, ...optModifiers);
                return this;
            })();
        }

        public async typeMasked(text: string | Key, ...optModifiers: Key[]): Promise<Environment> {
            return runAsAction(ctx, "typeMasked", async () => {
                ctx.logger.debug(`Typing text '****' via keyboard`);
                await keyboardApi.type(text, ...optModifiers);
                return this;
            })();
        }

        public async typeAndDecrypt(text: string, ...optModifiers: Key[]): Promise<Environment> {
            return runAsAction(ctx, "typeAndDecrypt", async () => {
                ctx.logger.debug(`Typing encrypted text ${text}`);
                const key = getEncryptionKey(project);
                await keyboardApi.typeAndDecrypt(key, text, ...optModifiers);
                return this;
            })();
        }

        public decryptSecret(secret: string): Promise<string> {
            return runAsAction(ctx, "decryptSecret", async () => {
                ctx.logger.debug(`Decrypting secret '${secret}'`);
                const key = getEncryptionKey(project);
                return await decrypt(key, secret);
            })();
        }

        public async keyDown(...keys: Key[]): Promise<Environment> {
            return runAsAction(ctx, "keyDown", async () => {
                ctx.logger.debug(`Pressing keys: ${keys}`);
                await keyboardApi.pressKey(...keys);
                return this;
            })();
        }

        public async keyUp(...keys: Key[]): Promise<Environment> {
            return runAsAction(ctx, "keyUp", async () => {
                ctx.logger.debug(`Releasing keys: ${keys}`);
                await keyboardApi.releaseKey(...keys);
                return this;
            })();
        }

        public async write(text: string): Promise<Environment> {
            return runAsAction(ctx, "write", async () => {
                ctx.logger.debug(`Writing: ${text} via keyboard`);
                await keyboardApi.type(text);
                return this;
            })();
        }

        public async mouseWheelDown(steps: number): Promise<Environment> {
            return runAsAction(ctx, "mouseWheelDown", async () => {
                ctx.logger.debug(`Scrolling down ${steps} px`);
                await mouseApi.scrollDown(steps);
                return this;
            })();
        }

        public async mouseWheelUp(steps: number): Promise<Environment> {
            return runAsAction(ctx, "mouseWheelUp", async () => {
                ctx.logger.debug(`Scrolling up ${steps} px`);
                await mouseApi.scrollUp(steps);
                return this;
            })();
        }

        public isWindows(): boolean {
            ctx.logger.debug(`Is Windows? '${process.platform === 'win32'}`);
            return process.platform === "win32";
        }

        public isLinux(): boolean {
            ctx.logger.debug(`Is Linux? '${process.platform === 'linux'}`);
            return process.platform === "linux";
        }

        public isDarwin(): boolean {
            ctx.logger.debug(`Is Darwin? '${process.platform === 'darwin'}`);
            return process.platform === "darwin";
        }

        public getOsIdentifier(): string {
            ctx.logger.debug(`Fetching OS identifier: ${process.platform}`);
            return process.platform;
        }

        public async runCommand(command: string, optThrowException: boolean = false): Promise<CommandLineResult> {
            return runAsAction(ctx, "runCommand", () => {
                ctx.logger.debug(`Executing command '${command}`);
                return new Promise<CommandLineResult>(async (resolve, reject) => {
                    try {
                        const result = await execute(command);
                        ctx.logger.debug(`Return code: ${result.getExitCode()}, Output: ${result.getOutput()}`);
                        if (result.getExitCode() !== 0 && optThrowException) {
                            reject(`Command execution failed with exit code '${result.getExitCode()}`);
                        } else {
                            resolve(result);
                        }
                    } catch (e) {
                        reject(e);
                    }
                });
            })();
        }

        public getEnv(key: string): string | null {
            return runAsAction(ctx, "getEnv", () => {
                ctx.logger.debug(`Accessing environment variable '${key}'`);
                return project.get(key);
            })();
        }

        public getEnvMasked(key: string): string | null {
            return runAsAction(ctx, "getEnvMasked", () => {
                ctx.logger.debug(`Accessing environment variable`);
                return project.get(key);
            })();
        }

        public getProperty(key: string): string | null {
            return runAsAction(ctx, "getProperty", () => {
                ctx.logger.debug(`Accessing property ${key}`);
                return project.get(key);
            })();
        }

        public getPropertyMasked(key: string): string | null {
            return runAsAction(ctx, "getPropertyMasked", () => {
                ctx.logger.debug(`Accessing property`);
                return project.get(key);
            })();
        }
    }
}

