import { Project, TestExecutionContext } from "@sakuli/core";
import { Environment } from "./environment.interface";
import { createEnvironmentClass } from "./sakuli-environment.class";
import { createThenableRegionClass } from "../region";
import { Key } from "../key.class";
import { CommandLineResult } from "./commandline-result.class";
import { ThenableEnvironment } from "./thenable-environment.interface";
import { Type } from "@sakuli/commons";

export function createThenableEnvironmentClass(
  ctx: TestExecutionContext,
  project: Project
): Type<ThenableEnvironment> {
  const Environment = createEnvironmentClass(ctx, project);
  const ThenableRegionClass = createThenableRegionClass(ctx, project);
  return class ThenableSakuliEnvironment {
    constructor(
      readonly env: Promise<Environment> = Promise.resolve(new Environment())
    ) {}

    cleanClipboard(): Promise<void> {
      return this.env.then((e) => e.cleanClipboard());
    }

    copyIntoClipboard(): ThenableSakuliEnvironment {
      return new ThenableSakuliEnvironment(
        this.env.then((e) => e.copyIntoClipboard())
      );
    }

    decryptSecret(secret: string): Promise<string> {
      return this.env.then((e) => e.decryptSecret(secret));
    }

    getClipboard(): Promise<string> {
      return this.env.then((e) => e.getClipboard());
    }

    getClipboardMasked(): Promise<string> {
      return this.env.then((e) => e.getClipboardMasked());
    }

    getEnv(key: string): Promise<string | null> {
      return this.env.then((e) => e.getEnv(key));
    }

    getEnvMasked(key: string): Promise<string | null> {
      return this.env.then((e) => e.getEnvMasked(key));
    }

    getOsIdentifier(): Promise<string> {
      return this.env.then((e) => e.getOsIdentifier());
    }

    getProperty(key: string): Promise<string | null> {
      return this.env.then((e) => e.getProperty(key));
    }

    getPropertyMasked(key: string): Promise<string | null> {
      return this.env.then((e) => e.getPropertyMasked(key));
    }

    getRegionFromFocusedWindow() {
      return new ThenableRegionClass(
        undefined,
        undefined,
        undefined,
        undefined,
        this.env.then((e) => e.getRegionFromFocusedWindow())
      );
    }

    getSimilarity(): Promise<number> {
      return this.env.then((e) => e.getSimilarity());
    }

    isDarwin(): Promise<boolean> {
      return this.env.then((e) => e.isDarwin());
    }

    isLinux(): Promise<boolean> {
      return this.env.then((e) => e.isLinux());
    }

    isWindows(): Promise<boolean> {
      return this.env.then((e) => e.isWindows());
    }

    keyDown(...keys: Key[]): ThenableSakuliEnvironment {
      return new ThenableSakuliEnvironment(
        this.env.then((e) => e.keyDown(...keys))
      );
    }

    keyUp(...keys: Key[]): ThenableSakuliEnvironment {
      return new ThenableSakuliEnvironment(
        this.env.then((e) => e.keyUp(...keys))
      );
    }

    mouseWheelDown(steps: number): ThenableSakuliEnvironment {
      return new ThenableSakuliEnvironment(
        this.env.then((e) => e.mouseWheelDown(steps))
      );
    }

    mouseWheelUp(steps: number): ThenableSakuliEnvironment {
      return new ThenableSakuliEnvironment(
        this.env.then((e) => e.mouseWheelUp(steps))
      );
    }

    paste(text: string): ThenableSakuliEnvironment {
      return new ThenableSakuliEnvironment(this.env.then((e) => e.paste(text)));
    }

    pasteAndDecrypt(text: string): ThenableSakuliEnvironment {
      return new ThenableSakuliEnvironment(
        this.env.then((e) => e.pasteAndDecrypt(text))
      );
    }

    pasteClipboard(): ThenableSakuliEnvironment {
      return new ThenableSakuliEnvironment(
        this.env.then((e) => e.pasteClipboard())
      );
    }

    pasteMasked(text: string): ThenableSakuliEnvironment {
      return new ThenableSakuliEnvironment(
        this.env.then((e) => e.pasteMasked(text))
      );
    }

    resetSimilarity(): Promise<void> {
      return this.env.then((e) => e.resetSimilarity());
    }

    runCommand(
      command: string,
      optThrowException: boolean
    ): Promise<CommandLineResult> {
      return this.env.then((e) => e.runCommand(command, optThrowException));
    }

    setClipboard(text: string): ThenableSakuliEnvironment {
      return new ThenableSakuliEnvironment(
        this.env.then((e) => e.setClipboard(text))
      );
    }

    setClipboardMasked(text: string): ThenableEnvironment {
      return new ThenableSakuliEnvironment(
        this.env.then((e) => e.setClipboardMasked(text))
      );
    }

    setSimilarity(similarity: number): Promise<void> {
      return this.env.then((e) => e.setSimilarity(similarity));
    }

    sleep(s: number): ThenableSakuliEnvironment {
      return new ThenableSakuliEnvironment(this.env.then((e) => e.sleep(s)));
    }

    sleepMs(ms: number): ThenableSakuliEnvironment {
      return new ThenableSakuliEnvironment(this.env.then((e) => e.sleepMs(ms)));
    }

    takeScreenshot(filename: string): Promise<string> {
      return this.env.then((e) => e.takeScreenshot(filename));
    }

    takeScreenshotWithTimestamp(filename: string): Promise<string> {
      return this.env.then((e) => e.takeScreenshotWithTimestamp(filename));
    }

    then<TResult1 = Environment, TResult2 = never>(
      onfulfilled?:
        | ((value: Environment) => PromiseLike<TResult1> | TResult1)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => PromiseLike<TResult2> | TResult2)
        | undefined
        | null
    ): PromiseLike<TResult1 | TResult2> {
      return this.env.then(onfulfilled, onrejected);
    }

    type(text: string, ...optModifiers: Key[]): ThenableSakuliEnvironment {
      return new ThenableSakuliEnvironment(
        this.env.then((e) => e.type(text, ...optModifiers))
      );
    }

    typeAndDecrypt(
      text: string,
      ...optModifiers: Key[]
    ): ThenableSakuliEnvironment {
      return new ThenableSakuliEnvironment(
        this.env.then((e) => e.typeAndDecrypt(text, ...optModifiers))
      );
    }

    typeMasked(
      text: string,
      ...optModifiers: Key[]
    ): ThenableSakuliEnvironment {
      return new ThenableSakuliEnvironment(
        this.env.then((e) => e.typeMasked(text, ...optModifiers))
      );
    }

    write(text: string): ThenableSakuliEnvironment {
      return new ThenableSakuliEnvironment(this.env.then((e) => e.write(text)));
    }
  };
}
