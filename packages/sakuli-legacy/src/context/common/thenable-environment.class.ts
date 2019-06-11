import {Project, TestExecutionContext} from "@sakuli/core";
import {Environment} from "./environment.interface";
import {createEnvironmentClass} from "./sakuli-environment.class";
import {createThenableRegionClass, ThenableRegion} from "./thenable-sakuli-region.class";
import {Key} from "./key.class";
import {CommandLineResult} from "./commandline-result.class";

export function createThenableEnvironmentClass(ctx: TestExecutionContext, project: Project) {
    const Environment = createEnvironmentClass(ctx, project);
    const ThenableRegionClass = createThenableRegionClass(ctx);
    return class ThenableEnvironment implements PromiseLike<Environment> {

        constructor(
            readonly env: Promise<Environment> = Promise.resolve(new Environment())
        ) {}

        cleanClipboard(): Promise<void> {
            return this.env.then(e => e.cleanClipboard());
        }

        copyIntoClipboard(): ThenableEnvironment {
            return new ThenableEnvironment(this.env.then(e => e.copyIntoClipboard()));
        }

        decryptSecret(secret: string): Promise<string> {
            return this.env.then(e => e.decryptSecret(secret));
        }

        getClipboard(): Promise<string> {
            return this.env.then(e => e.getClipboard());
        }

        getEnv(key: string): Promise<string | null> {
            return this.env.then(e => e.getEnv(key))
        }

        getOsIdentifier(): Promise<string> {
            return this.env.then(e => e.getOsIdentifier())
        }

        getProperty(key: string): Promise<string | null> {
            return this.env.then(e => e.getProperty(key))
        }

        getRegionFromFocusedWindow() {
            return new ThenableRegionClass(
                undefined,
                undefined,
                undefined,
                undefined,
                this.env.then(e => e.getRegionFromFocusedWindow())
            );
        }

        getSimilarity(): Promise<number> {
            return this.env.then(e => e.getSimilarity());
        }

        isDarwin(): Promise<boolean> {
            return this.env.then(e => e.isDarwin());
        }

        isLinux(): Promise<boolean> {
            return this.env.then(e => e.isLinux());
        }

        isWindows(): Promise<boolean> {
            return this.env.then(e => e.isWindows());
        }

        keyDown(...keys: Key[]): ThenableEnvironment {
            return new ThenableEnvironment(this.env.then(e => e.keyDown(...keys)));
        }

        keyUp(...keys: Key[]): ThenableEnvironment {
            return new ThenableEnvironment(this.env.then(e => e.keyUp(...keys)));
        }

        mouseWheelDown(steps: number): ThenableEnvironment {
            return new ThenableEnvironment(this.env.then(e => e.mouseWheelDown(steps)));
        }

        mouseWheelUp(steps: number): ThenableEnvironment {
            return new ThenableEnvironment(this.env.then(e => e.mouseWheelUp(steps)));
        }

        paste(text: string): ThenableEnvironment {
            return new ThenableEnvironment(this.env.then(e => e.paste(text)));
        }

        pasteAndDecrypt(text: string): ThenableEnvironment {
            return new ThenableEnvironment(this.env.then(e => e.pasteAndDecrypt(text)));
        }

        pasteClipboard(): ThenableEnvironment {
            return new ThenableEnvironment(this.env.then(e => e.pasteClipboard()));
        }

        pasteMasked(text: string): ThenableEnvironment {
            return new ThenableEnvironment(this.env.then(e => e.pasteMasked(text)));
        }

        resetSimilarity(): Promise<void> {
            return this.env.then(e => e.resetSimilarity())
        }

        runCommand(command: string, optThrowException: boolean): Promise<CommandLineResult> {
            return this.env.then(e => e.runCommand(command, optThrowException));
        }

        setClipboard(text: string): ThenableEnvironment {
            return new ThenableEnvironment(this.env.then(e => e.setClipboard(text)));
        }

        setSimilarity(similarity: number): Promise<void> {
            return this.env.then(e => e.setSimilarity(similarity));
        }

        sleep(s: number): ThenableEnvironment {
            return new ThenableEnvironment(this.env.then(e => e.sleep(s)));
        }

        sleepMs(ms: number): ThenableEnvironment {
            return new ThenableEnvironment(this.env.then(e => e.sleepMs(ms)));
        }

        takeScreenshot(filename: string): Promise<string> {
            return this.env.then(e => e.takeScreenshot(filename));
        }

        takeScreenshotWithTimestamp(filename: string): Promise<string> {
            return this.env.then(e => e.takeScreenshotWithTimestamp(filename));
        }

        then<TResult1 = Environment, TResult2 = never>(onfulfilled?: ((value: Environment) => (PromiseLike<TResult1> | TResult1)) | undefined | null, onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | undefined | null): PromiseLike<TResult1 | TResult2> {
            return this.env.then(
                onfulfilled,
                onrejected
            );
        }

        type(text: string, ...optModifiers: Key[]): ThenableEnvironment {
            return new ThenableEnvironment(this.env.then(e => e.type(text, ...optModifiers)));
        }

        typeAndDecrypt(text: string, ...optModifiers: Key[]): ThenableEnvironment {
            return new ThenableEnvironment(this.env.then(e => e.typeAndDecrypt(text, ...optModifiers)));
        }

        typeMasked(text: string, ...optModifiers: Key[]): ThenableEnvironment {
            return new ThenableEnvironment(this.env.then(e => e.typeMasked(text, ...optModifiers)));
        }

        write(text: string): ThenableEnvironment {
            return new ThenableEnvironment(this.env.then(e => e.write(text)));
        }

    }

}