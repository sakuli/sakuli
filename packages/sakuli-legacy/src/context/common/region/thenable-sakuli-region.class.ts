import { Region } from "./region.interface";
import { createRegionClass } from "./sakuli-region.class";
import { Project, TestExecutionContext } from "@sakuli/core";
import { Key } from "../key.class";
import { MouseButton } from "../button.class";
import { ThenableRegion } from "./thenable-region.interface";
import { Type } from "@sakuli/commons";

export function createThenableRegionClass(
  ctx: TestExecutionContext,
  project: Project
): Type<ThenableRegion> {
  const SakuliRegion = createRegionClass(ctx, project);
  return class ThenableSakuliRegion implements ThenableRegion {
    constructor(
      public _left?: number,
      public _top?: number,
      public _width?: number,
      public _height?: number,
      readonly _region?: Promise<Region>
    ) {
      if (!this._region) {
        this._region = Promise.resolve(
          new SakuliRegion(this._left, this._top, this._width, this._height)
        );
      }
    }

    get region(): Promise<Region> {
      /**
       * setting the region in the constructor ensures that it is eventually not undefined or null
       */
      return this._region!;
    }

    createReturn(then: (r: Region) => Promise<Region>): ThenableRegion {
      return new ThenableSakuliRegion(
        this._left,
        this._top,
        this._width,
        this._height,
        this.region!.then(then)
      );
    }

    above(range: number): ThenableRegion {
      return this.createReturn((r) => r.above(range));
    }

    below(range: number): ThenableRegion {
      return this.createReturn((r) => r.below(range));
    }

    click(): ThenableRegion {
      return this.createReturn((r) => r.click());
    }

    deleteChars(amountOfChars: number): ThenableRegion {
      return this.createReturn((r) => r.deleteChars(amountOfChars));
    }

    doubleClick(): ThenableRegion {
      return this.createReturn((r) => r.doubleClick());
    }

    dragAndDropTo(targetRegion: Region): ThenableRegion {
      return this.createReturn((r) => r.dragAndDropTo(targetRegion));
    }

    exists(imageName: string, optWaitSeconds: number): ThenableRegion {
      return this.createReturn((r) => r.exists(imageName, optWaitSeconds));
    }

    extractText(): ThenableRegion {
      return this.createReturn((r) => r.extractText());
    }

    find(imageName: string): ThenableRegion {
      return this.createReturn((r) => r.find(imageName));
    }

    findRegion(): ThenableRegion {
      return this.createReturn((r) => r.findRegion());
    }

    getH(): Promise<number | undefined> {
      return this.region.then((r) => r.getH());
    }

    getW(): Promise<number | undefined> {
      return this.region.then((r) => r.getW());
    }

    getX(): Promise<number | undefined> {
      return this.region.then((r) => r.getX());
    }

    getY(): Promise<number | undefined> {
      return this.region.then((r) => r.getY());
    }

    grow(range: number): ThenableRegion {
      return this.createReturn((r) => r.grow(range));
    }

    highlight(seconds: number): ThenableRegion {
      return this.createReturn((r) => r.highlight(seconds));
    }

    keyDown(...keys: Key[]): ThenableRegion {
      return this.createReturn((r) => r.keyDown(...keys));
    }

    keyUp(...keys: Key[]): ThenableRegion {
      return this.createReturn((r) => r.keyUp(...keys));
    }

    left(range: number): ThenableRegion {
      return this.createReturn((r) => r.left(range));
    }

    mouseDown(mouseButton: MouseButton): ThenableRegion {
      return this.createReturn((r) => r.mouseDown(mouseButton));
    }

    mouseMove(): ThenableRegion {
      return this.createReturn((r) => r.mouseMove());
    }

    mouseUp(mouseButton: MouseButton): ThenableRegion {
      return this.createReturn((r) => r.mouseUp(mouseButton));
    }

    mouseWheelDown(steps: number): ThenableRegion {
      return this.createReturn((r) => r.mouseWheelDown(steps));
    }

    mouseWheelUp(steps: number): ThenableRegion {
      return this.createReturn((r) => r.mouseWheelUp(steps));
    }

    move(offsetX: number, offsetY: number): ThenableRegion {
      return this.createReturn((r) => r.move(offsetX, offsetY));
    }

    paste(text: string): ThenableRegion {
      return this.createReturn((r) => r.paste(text));
    }

    pasteAndDecrypt(text: string): ThenableRegion {
      return this.createReturn((r) => r.pasteAndDecrypt(text));
    }

    pasteMasked(text: string): ThenableRegion {
      return this.createReturn((r) => r.pasteMasked(text));
    }

    right(range: number): ThenableRegion {
      return this.createReturn((r) => r.right(range));
    }

    rightClick(): ThenableRegion {
      return this.createReturn((r) => r.rightClick());
    }

    setH(height: number): ThenableRegion {
      return this.createReturn((r) => r.setH(height));
    }

    setW(width: number): ThenableRegion {
      return this.createReturn((r) => r.setW(width));
    }

    setX(x: number): ThenableRegion {
      return this.createReturn((r) => r.setX(x));
    }

    setY(y: number): ThenableRegion {
      return this.createReturn((r) => r.setY(y));
    }

    sleep(seconds: number): ThenableRegion {
      return this.createReturn((r) => r.sleep(seconds));
    }

    sleepMs(milliseconds: number): ThenableRegion {
      return this.createReturn((r) => r.sleepMs(milliseconds));
    }

    takeScreenshot(filename: string): Promise<string> {
      return this.region.then((r) => r.takeScreenshot(filename));
    }

    takeScreenshotWithTimestamp(filename: string): Promise<string> {
      return this.region.then((r) => r.takeScreenshotWithTimestamp(filename));
    }

    then<TResult1 = Region, TResult2 = any>(
      onfulfilled?:
        | ((value: Region) => PromiseLike<TResult1> | TResult1)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => PromiseLike<TResult2> | TResult2)
        | undefined
        | null
    ): PromiseLike<TResult1 | TResult2> {
      return this.region.then(onfulfilled, onrejected);
    }

    type(text: string, ...optModifiers: Key[]): ThenableRegion {
      return this.createReturn((r) => r.type(text, ...optModifiers));
    }

    typeAndDecrypt(text: string, ...optModifiers: Key[]): ThenableRegion {
      return this.createReturn((r) => r.typeAndDecrypt(text, ...optModifiers));
    }

    typeMasked(text: string, ...optModifiers: Key[]): ThenableRegion {
      return this.createReturn((r) => r.typeMasked(text, ...optModifiers));
    }

    waitForImage(imageName: string, seconds: number): ThenableRegion {
      return this.createReturn((r) => r.waitForImage(imageName, seconds));
    }

    write(text: string): ThenableRegion {
      return this.createReturn((r) => r.write(text));
    }
  };
}
